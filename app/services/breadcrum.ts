type BreadcrumbMap = Record<string, string>;
type DynamicSegments = Record<string, string>;

export function generateBreadcrumbs(
  pathname: string,
  breadcrumbMap: BreadcrumbMap,
  dynamicSegments: DynamicSegments = {},
) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map(
      (segment) =>
        dynamicSegments[segment] ?? breadcrumbMap[segment] ?? segment,
    );
}
