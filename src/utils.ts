// eslint-disable-next-line import/prefer-default-export
export function promisify<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (value?: unknown) => void;
} {
  let res = (value: T) => {};
  let rej = (value?: unknown) => {};
  const promise = new Promise<T>((rs, rj) => {
    res = rs;
    rej = rj;
  });
  return {
    promise,
    resolve: res,
    reject: rej,
  };
}
