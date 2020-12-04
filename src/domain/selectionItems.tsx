export const selectionItems = (
  valueSelected: string[],
  allValues: string,
  noSpecificValue: string
) => {
  if (valueSelected.includes(allValues)) {
    if (valueSelected[valueSelected.length - 1] === allValues) {
      valueSelected = valueSelected.filter(
        (item: string) => item === allValues
      );
    } else {
      valueSelected = valueSelected.filter(
        (item: string) => item !== allValues
      );
    }
  }

  if (valueSelected.includes(noSpecificValue)) {
    if (valueSelected[valueSelected.length - 1] === noSpecificValue) {
      valueSelected = valueSelected.filter(
        (item: string) => item === noSpecificValue
      );
    } else {
      valueSelected = valueSelected.filter(
        (item: string) => item !== noSpecificValue
      );
    }
  }

  return valueSelected;
};
