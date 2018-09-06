export function generateSearchingParamsObject(searchText) {
  const result = {} as any;

  if (searchText !== '') {
    result.content = new RegExp(`.*${searchText}.*`, 'i');
  }

  return result;
}