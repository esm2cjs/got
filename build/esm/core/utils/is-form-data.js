import is from '@esm2cjs/is';
export default function isFormData(body) {
    return is.nodeStream(body) && is.function_(body.getBoundary);
}
