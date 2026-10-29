// getStaticPaths helper: every page exists once per design.
import { VARIANTS, type V } from "./site";
export const perVariant = <T extends object>(extra: (v: V) => { params: Record<string, string>; props?: T }[] = () => [{ params: {} }]) =>
  VARIANTS.flatMap((v) => extra(v).map((x) => ({ params: { v, ...x.params }, props: { v, ...(x.props ?? {}) } as T & { v: V } })));
