import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { Input } from '@pdftron/webviewer-react-toolkit';
import CreatableDropdown from '../CreatableDropdown';


import './FormFieldEditPopup.scss';
import CreatableList from '../CreatableList';
import getAnnotationManager from 'src/core/getAnnotationManager';

const availableFields = [
  'Balance Due At Closing',
  'Buyer Address 1',
  'Buyer Address 2',
  'Buyer Address 3',
  'Buyer Address 4',
  'Buyer Name 1',
  'Buyer Name 2',
  'Buyer Name 3',
  'Buyer Name 4',
  'Buyer Signature 1',
  'Buyer Signature 2',
  'Buyer Signature 3',
  'Buyer Signature 4',
  'Buyer\'s Agent Name',
  'Closing Date Time',
  'Closing Date',
  'Earnest Money Deposit',
  'Escrow Agent',
  'Fixed Dollar Figure',
  'Fixed Number',
  'Fixed Percentage',
  'Inspection Deadline Date',
  'Mortgage Amount',
  'Mortgage Application Date',
  'Mortgage Approval Date',
  'Offer Deadline Date',
  'Offer Deadline Time',
  'Offer Deposit',
  'P&S Deadline Date',
  'P&S Deadline Time',
  'Property Address',
  'Purchase Price',
  'Seller Address 1',
  'Seller Address 2',
  'Seller Address 3',
  'Seller Address 4',
  'Seller Name 1',
  'Seller Name 2',
  'Seller Name 3',
  'Seller Name 4',
  'Seller Signature 1',
  'Seller Signature 2',
  'Seller Signature 3',
  'Seller Signature 4',
  'Seller\'s Agent Name',
];

const boldFields = [
  'Buyer Address 2',
  'Buyer Address 4',
];

const FormFieldEditPopup = ({
  fields,
  flags,
  closeFormFieldEditPopup,
  isValid,
  validationMessage,
  radioButtonGroups,
  options,
  onOptionsChange,
  annotation,
  selectedRadioGroup,
  getPageHeight,
  getPageWidth,
  redrawAnnotation,
  name
}) => {
  const { t } = useTranslation();
  const className = classNames({
    Popup: true,
    FormFieldEditPopup: true,
  });

  const [width, setWidth] = useState((annotation.Width).toFixed(0));
  const [height, setHeight] = useState((annotation.Height).toFixed(0));

  const [initialWidth] = useState((annotation.Width).toFixed(0));
  const [initialHeight] = useState((annotation.Height).toFixed(0));

  // If no radio group is yet set, set this as null as the select input will then show the correct prompt
  const [radioButtonGroup, setRadioButtonGroup] = useState(selectedRadioGroup === '' ? null : { value: selectedRadioGroup, label: selectedRadioGroup });

  useEffect(() => {
    // When we open up the popup the async call to set the right radio group may not be finished
    // we deal with this timing issue by updating state when the prop is refreshed
    if (selectedRadioGroup !== '') {
      setRadioButtonGroup({ value: selectedRadioGroup, label: selectedRadioGroup });
    } else {
      setRadioButtonGroup(null);
    }
  }, [selectedRadioGroup]);

  function onSelectInputChange(field, input) {
    if (input === null) {
      field.onChange('');
      setRadioButtonGroup(null);
    } else {
      field.onChange(input.value);
      setRadioButtonGroup({ value: input.value, label: input.value });
    }
  }

  function onWidthChange(width) {
    const validatedWidth = validateWidth(width);
    annotation.setWidth(validatedWidth);
    setWidth(validatedWidth);
    redrawAnnotation(annotation);
  }

  function onHeightChange(height) {
    const validatedHeight = validateHeight(height);
    annotation.setHeight(validatedHeight);
    setHeight(validatedHeight);
    redrawAnnotation(annotation);
  }

  function validateWidth(width) {
    // const documentWidth = getPageWidth();
    // const maxWidth = documentWidth - annotation.X;
    // if (width > maxWidth) {
    //   return maxWidth;
    // }
    // return width;
  }

  function validateHeight(height) {
    // const documentHeight = getPageHeight();
    // const maxHeight = documentHeight - annotation.Y;
    // if (height > maxHeight) {
    //   return maxHeight;
    // }
    // return height;
  }

  function onCancel() {
    // If width/height changed return to original values
    if (width !== initialWidth || height !== initialHeight) {
      annotation.setWidth(initialWidth);
      annotation.setHeight(initialHeight);
    }
    redrawAnnotation(annotation);
    closeFormFieldEditPopup();
  }

  function renderInput(field) {
    if (field.type === 'text') {
      return renderTextInput(field);
    }
    if (field.type === 'select') {
      return renderSelectInput(field);
    }
  }

  function renderTextInput(field) {
    return (
      <Input
        type="text"
        onChange={(event) => field.onChange(event.target.value)}
        value={field.value}
        fillWidth="false"
        messageText={field.required && !isValid ? t(validationMessage) : ''}
        message={field.required && !isValid ? 'warning' : 'default'}
        autoFocus={field.focus}
      />
    );
  }

  function renderSelectInput(field) {
    const fields = [];
    const fieldManager = getAnnotationManager().getFieldManager();
    fieldManager.forEachField((field) => fields.push(field.name));

    let displayOptions = availableFields.map((group) => ({ value: group, label: group }));
    displayOptions.forEach((option, index) => {
      const optionStr = `${option.value} #1`;
      displayOptions[index] = { value: optionStr, label: option.value };
    });

    try {
      fields.forEach((option) => {
        const optionSplit = option.split('#');
        const optionStr = `${optionSplit[0]}#${parseInt(optionSplit[1]) + 1}`;
        displayOptions.push({ value: optionStr, label: optionSplit[0] });
      });

      displayOptions.sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0));

      if (!isValid) {
        let index = 0;
        try {
          while (fields.includes(displayOptions[index].value) && index < displayOptions.length) {
            index++;
          }
          setTimeout(() => field.onChange(displayOptions[0].value), 300);
        } catch (error) {
          console.log(error);
        }
      }

      if (displayOptions.filter((i) => i.value === name).length === 0) {
        field.onChange(displayOptions[0].value);
      }
    } catch (error) {
      console.log(error);
    } finally {
      displayOptions = displayOptions.filter((option) => {
        return !fields.includes(option.value);
      });
    }
    return (
      <>
        <CreatableDropdown
          textPlaceholder={t('formField.formFieldPopup.fieldName')}
          options={displayOptions}
          onChange={(inputValue) => onSelectInputChange(field, inputValue)}
          value={radioButtonGroup}
          isValid={isValid}
          messageText={t(validationMessage)}
          name={name}
          boldFields = {boldFields}
        />
        {/* <div className="radio-group-label">{t('formField.formFieldPopup.radioGroups')}</div> */}
      </>);
  }

  function renderListOptions() {
    return (
      <div className="field-options-container">
        {t('formField.formFieldPopup.options')}
        <CreatableList
          options={options}
          onOptionsUpdated={onOptionsChange}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="fields-container">
        {fields.map((field) => (
          <div className="field-input" key={field.label}>
            <label>{t(field.label)}:</label>
            {renderInput(field)}
          </div>
        ))}
      </div>
      {options && renderListOptions()}
      {/* <div className="field-flags-container">
        <span className="field-flags-title">{t('formField.formFieldPopup.flags')}</span>
        {flags.map((flag) => (
          <Choice
            key={flag.label}
            checked={flag.isChecked}
            onChange={(event) => flag.onChange(event.target.checked)}
            label={t(flag.label)}
          />
        ))}
      </div>
      <DimensionsInput
        width={width}
        height={height}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
      /> */}
      <div className="form-buttons-container">
        <Button
          className="cancel-form-field-button"
          onClick={onCancel}
          dataElement="formFieldCancel"
          label={t('formField.formFieldPopup.cancel')}
        />
        <Button
          className="ok-form-field-button"
          onClick={closeFormFieldEditPopup}
          dataElement="formFieldOK"
          label={t('action.ok')}
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

// const DimensionsInput = ({ width, height, onWidthChange, onHeightChange }) => {
// const { t } = useTranslation();

// return (
//   <div className="form-dimension">
//     <div>{t('formField.formFieldPopup.size')}:</div>
//     <div className="form-dimension-input">
//       <input
//         id="form-field-width"
//         type="number"
//         min={0}
//         value={width}
//         onChange={(e) => onWidthChange(e.target.value)}
//       /> {t('formField.formFieldPopup.width')}
//     </div>
//     <div className="form-dimension-input">
//       <input
//         id="form-field-height"
//         type="number"
//         min={0}
//         value={height}
//         onChange={(e) => onHeightChange(e.target.value)}
//       /> {t('formField.formFieldPopup.height')}
//     </div>
//   </div>
// );
// };
export default FormFieldEditPopup;
