import Api from "./api";

export default new Api(`${process.env.NEXT_PUBLIC_API_END_POINT}api/`);

export const ssrNextApi = new Api(
  `${process.env.NEXT_PUBLIC_SSR_API_END_POINT}api/`
);
