export function generateSearchingParamsObject(searchParams) {
  const result = {} as any;

  if (searchParams.searchText !== undefined) {
    result.content = new RegExp(`.*${searchParams.searchText}.*`, 'i');
  }

  if (searchParams.userId !== undefined) {
    result.userId = searchParams.userId;
  }

  return result;
}