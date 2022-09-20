#!/bin/bash
shopt -s nullglob

# un-ignore build folder
sed -i 's#/build##' .gitignore
sed -i 's#build/##' .gitignore

TSCONFIG=$(cat tsconfig.json \
	| sed 's|//.*||' \
	| jq --tab '
		.compilerOptions.outDir = "build/esm"
		| .include = ["source"]
	')
echo "$TSCONFIG" > tsconfig.json

echo '{ "type": "module" }' > source/package.json
echo '{ "type": "module" }' > test/package.json

# Replace module imports in all ts files
readarray -d '' files < <(find {source,test} -name "*.ts" -print0)
function replace_imports () {
	from=$1
	to="${2:-@esm2cjs/$from}"
	for file in "${files[@]}" ; do
		sed -i "s#'$from'#'$to'#g" "$file"
	done
}
replace_imports "@sindresorhus/is" "@esm2cjs/is"
replace_imports "@szmarczak/http-timer" "@esm2cjs/http-timer"
replace_imports "cacheable-request"
replace_imports "form-data-encoder"
replace_imports "lowercase-keys"
replace_imports "p-cancelable"

# This test doesn't work locally
sed -i "s#test('timeouts are emitted ASAP'#test.skip('timeouts are emitted ASAP'#" test/timeout.ts

PJSON=$(cat package.json | jq --tab '
	del(.type)
	| .description = .description + ". This is a fork of " + .repository + ", but with CommonJS support."
	| .repository = "esm2cjs/" + .name
	| .name |= "@esm2cjs/" + .
	| .author = { "name": "Dominic Griesel", "email": "d.griesel@gmx.net" }
	| .publishConfig = { "access": "public" }
	| .funding = "https://github.com/sponsors/AlCalzone"
	| .main = "build/cjs/index.js"
	| .module = "build/esm/index.js"
	| .files = ["build/"]
	| .exports = {}
	| .exports["."].import = "./build/esm/index.js"
	| .exports["."].require = "./build/cjs/index.js"
	| .exports["./package.json"] = "./package.json"
	| .types = "build/esm/index.d.ts"
	| .typesVersions = {}
	| .typesVersions["*"] = {}
	| .typesVersions["*"]["build/esm/index.d.ts"] = ["build/esm/index.d.ts"]
	| .typesVersions["*"]["build/cjs/index.d.ts"] = ["build/esm/index.d.ts"]
	| .typesVersions["*"]["*"] = ["build/esm/*"]
	| .scripts["to-cjs"] = "esm2cjs --in build/esm --out build/cjs -t node12"
	| del(.scripts.prepare)
	| .scripts.test = "ava"

	| .dependencies["@esm2cjs/is"] = .dependencies["@sindresorhus/is"]
	| del(.dependencies["@sindresorhus/is"])
	| .dependencies["@esm2cjs/http-timer"] = .dependencies["@szmarczak/http-timer"]
	| del(.dependencies["@szmarczak/http-timer"])
	| .dependencies["@esm2cjs/cacheable-request"] = .dependencies["cacheable-request"]
	| del(.dependencies["cacheable-request"])
	| .dependencies["@esm2cjs/form-data-encoder"] = .dependencies["form-data-encoder"]
	| del(.dependencies["form-data-encoder"])
	| .dependencies["@esm2cjs/lowercase-keys"] = .dependencies["lowercase-keys"]
	| del(.dependencies["lowercase-keys"])
	| .dependencies["@esm2cjs/p-cancelable"] = .dependencies["p-cancelable"]
	| del(.dependencies["p-cancelable"])

	| .xo.ignores |= . + ["build", "test/", "**/*.d.ts"]
	| .ava.extensions.mts = "module"
')
echo "$PJSON" > package.json

# Update package.json -> version if upstream forgot to update it
if [[ ! -z "${TAG}" ]] ; then
	VERSION=$(echo "${TAG/v/}")
	PJSON=$(cat package.json | jq --tab --arg VERSION "$VERSION" '.version = $VERSION')
	echo "$PJSON" > package.json
fi

npm i
npm run build

npm i -D @alcalzone/esm2cjs
npm run to-cjs
npm uninstall -D @alcalzone/esm2cjs

PJSON=$(cat package.json | jq --tab 'del(.scripts["to-cjs"])')
echo "$PJSON" > package.json

npm test
