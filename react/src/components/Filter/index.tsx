import { ChangeEvent, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Filter.scss';
import { FilterByParamValue, OrderByParamValue, FilterConditionParamValue } from '../../lib/updateQueryString';


export interface FilterState {
  field: FilterByParamValue,
  condition: FilterConditionParamValue,
  value: string,
}

const placeholder: { [key in FilterByParamValue]: string } = {
  [OrderByParamValue.name]: 'lorem ipsum',
  [OrderByParamValue.qty]: '42',
  [OrderByParamValue.distance]: '324 или 324.54',
}

const validateRequired = (val: string | undefined) => Boolean(val?.trim());

const commonConditions = [
  [FilterConditionParamValue.eq, '='],
  [FilterConditionParamValue.gt, '>'],
  [FilterConditionParamValue.lt, '<'],
];

const filterData = {
  field: {
    values: [
      [OrderByParamValue.name, 'Название'],
      [OrderByParamValue.qty, 'Количество'],
      [OrderByParamValue.distance, 'Расстояние'],
    ],
    validate: {
      required: {
        error: 'Необходимо заполнить',
        fn: validateRequired,
      },
    }
  },
  condition: {
    values: {
      [OrderByParamValue.name]: [
        ...commonConditions,
        [FilterConditionParamValue.like, 'содержит']
      ],
      [OrderByParamValue.qty]: commonConditions,
      [OrderByParamValue.distance]: commonConditions,
    },
    validate: {
      required: {
        error: 'Необходимо заполнить',
        fn: validateRequired,
      },
    }
  },
  value: {
    placeholder,
    validate: {
      required: {
        error: 'Необходимо заполнить',
        fn: validateRequired,
      },
      name: {
        error: 'Название должно иметь длину более 3 знаков',
        fn: (val: string | undefined) => Number(val?.trim().length) >= 3,
      },
      qty: {
        error: 'Количество должно быть целым положительным числом',
        fn: (val: string | undefined) => Number.isInteger(Number(val))
          && Number(val) >= -0
          && !val?.startsWith('-'),
      },
      distance: {
        error: 'Количество должно быть целым положительным числом',
        fn: (val: string | undefined) => val
          && String(parseFloat(val)) === val
          && val !== 'NaN',
      },
    }
  },
}

interface Props {
  filter: FilterState | null,
  setFilter(filter: FilterState | null): void,
}


function Filter({ filter, setFilter }: Props) {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof FilterState]: string[] }>({
    field: [],
    condition: [],
    value: [],
  });

  const [field, setField] = useState(filter?.field);
  const [condition, setCondition] = useState(filter?.condition);
  const [value, setValue] = useState(filter?.value);

  const formElement = useRef(null);

  const onChange = <S,>(setter: (state: S) => void) =>
    (event: ChangeEvent<HTMLSelectElement>) => setter(event.target.value as S);

  const onChangeValueField = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  const resetFilter = () => {
    setFilter(null);
    setField(undefined);
    setCondition(undefined);
    setValue(undefined);
    formElement.current && (formElement.current as HTMLFormElement).reset();
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setErrors((prev) => ({
      ...prev,
      field: filterData.field.validate.required.fn(field as string)
        ? []
        : [filterData.field.validate.required.error]
    }));
    setErrors((prev) => ({
      ...prev,
      condition: filterData.condition.validate.required.fn(condition as string)
        ? []
        : [filterData.condition.validate.required.error]
    }));

    let valueErrors: string[] = [];
    if (!filterData.value.validate.required.fn(value as string)) {
      valueErrors.push(filterData.value.validate.required.error);
    }
    switch (field) {
      case OrderByParamValue.name:
        if (!filterData.value.validate.name.fn(value as string)) {
          valueErrors.push(filterData.value.validate.name.error);
        }
        break;
      case OrderByParamValue.qty:
        if (!filterData.value.validate.qty.fn(value as string)) {
          valueErrors.push(filterData.value.validate.qty.error);
        }
        break;
      case OrderByParamValue.distance:
        if (!filterData.value.validate.distance.fn(value as string)) {
          valueErrors.push(filterData.value.validate.distance.error);
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({
      ...prev,
      value: valueErrors,
    }))

    setValidated(true);

    if (
      field && condition && value
      && errors.field.length === 0 && errors.condition.length === 0 && errors.value.length === 0
    ) {
      setFilter({ field, condition, value })
    }
  };

  const renderEmptyOption = (filter: FilterState | null) => {
    return filter === null && <option disabled value="DEFAULT"> ----- </option>
  }

  const renderErrors = (column: keyof FilterState) => (
    <Form.Control.Feedback type="invalid">
      {errors[column].join(', ')}
    </Form.Control.Feedback>
  )

  console.log('filter = ', filter);
  console.log('field = ', field);
  console.log('condition = ', condition);
  console.log('value = ', value);
  return (
    <Form className="mt-3 mb-5" noValidate onSubmit={handleSubmit} ref={formElement}>
      <Row>
        <Form.Group className="mb-3" as={Col} >
          <Form.Label>Фильтр по колонке</Form.Label>
          <Form.Select
            onChange={onChange<FilterState['field']>(setField)}
            isInvalid={validated && errors.field.length > 0}
            defaultValue={'DEFAULT'}
            value={field || 'DEFAULT'}
          >
            {renderEmptyOption(filter)}
            {filterData.field.values.map((val) => (
              <option key={val[0]} value={val[0]}>{val[1]}</option>
            ))}
          </Form.Select>
          {renderErrors('field')}
        </Form.Group>
        <Form.Group className="mb-3" as={Col} >
          <Form.Label>Условие</Form.Label>
          <Form.Select
            onChange={onChange<FilterState['condition']>(setCondition)}
            isInvalid={validated && errors.condition.length > 0}
            defaultValue={'DEFAULT'}
            value={condition || 'DEFAULT'}
          >
            {renderEmptyOption(filter)}
            {(field ? filterData.condition.values[field] : commonConditions).map((val) => (
              <option key={val[0]} value={val[0]}>{val[1]}</option>
            ))}
          </Form.Select>
          {renderErrors('condition')}
        </Form.Group>
        <Form.Group className="mb-3" as={Col} >
          <Form.Label>Значение</Form.Label>
          <Form.Control
            placeholder={field && placeholder[field]}
            isInvalid={validated && errors.value.length > 0}
            onChange={onChangeValueField}
            value={value || ''}
          />
          {renderErrors('value')}
        </Form.Group>
      </Row>
      <Button variant="primary" type="submit">
        Отфильтровать
      </Button>
      <Button variant="outline-secondary" type="button" className="ms-4" onClick={resetFilter}>
        Сбросить фильтр
      </Button>
    </Form>
  );
}

export default Filter;
