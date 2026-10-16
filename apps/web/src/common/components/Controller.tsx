import {
  Controller as ReactHookFormController,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

export default function Controller<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  const { defaultValue, render, ...controllerProps } = props;

  return (
    <ReactHookFormController
      {...controllerProps}
      defaultValue={defaultValue}
      render={({ field, ...renderProps }) =>
        render({
          ...renderProps,
          field: {
            ...field,
            value:
              field.value === undefined && defaultValue !== undefined
                ? defaultValue
                : field.value,
          },
        })
      }
    />
  );
}
