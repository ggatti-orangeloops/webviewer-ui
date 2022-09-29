import React from 'react';
// import { useTranslation } from 'react-i18next';
import Select from 'react-select';
// import getAnnotationManager from 'src/core/getAnnotationManager';
// import getFormFieldCreationManager from 'src/core/getFormFieldCreationManager';


import './CreatableDropdown.scss';

const CreatableDropdown = ({
  onChange,
  // onInputChange,
  options,
  // onCreateOption,
  // textPlaceholder,
  // value,
  // isClearable,
  // isValid,
  messageText,
  name
}) => {
  // const { t } = useTranslation();

  // const customStyles = {
  //   control: (provided, state) => {
  //     return {
  //       ...provided,
  //       backgroundColor: 'var(--component-background)',
  //       borderColor: state.selectProps.isValid ? 'hsl(0, 0%, 80%)' : 'hsl(28, 80%, 52%)',
  //       boxShadow: state.selectProps.isValid ? null : '0 0 0 2px rgba(230, 126, 34, 0.4)',
  //       '&:hover': {
  //         borderColor: state.selectProps.isValid ? 'hsl(0, 0%, 70%)' : 'hsl(28, 80%, 52%)',
  //       }
  //     };
  //   },
  //   singleValue: (provided) => ({
  //     ...provided,
  //     color: 'var(--text-color)',
  //   }),
  //   menu: (provided) => ({
  //     ...provided,
  //     backgroundColor: 'var(--component-background)',
  //     color: 'var(--text-color)',
  //   }),
  //   option: (provided) => ({
  //     ...provided,
  //     backgroundColor: 'var(--component-background)',
  //     color: 'var(--text-color)',
  //     '&:hover': {
  //       backgroundColor: 'var(--popup-button-hover)',
  //     }
  //   }),
  //   input: (provided) => ({
  //     ...provided,
  //     backgroundColor: 'var(--component-background)',
  //     color: 'var(--text-color)',
  //   }),
  // };

  const foundOption = (option) => option.value === name;
  const optionIndex = Math.max(0, options.findIndex(foundOption));


  return (
    <div>
      <Select  onChange={onChange} options={options} value={options[optionIndex]}/>
      {messageText ? <div className="messageText">{messageText}</div> : undefined}
    </div>
  );
};

export default CreatableDropdown;
