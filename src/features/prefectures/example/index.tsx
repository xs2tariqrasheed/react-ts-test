import Button from "./button";
import MyCheckbox from "./checkbox";
import MyRadioButton from "./radioButton";

const Example = () => {
  const handleRadioChange = (value: any) => {
    console.log("Selected value:", value);
  };
  return (
    <>
      <Button />
      <MyCheckbox checked />
      <MyRadioButton
        label="Option 1"
        value="option1"
        checked={true}
        onChange={handleRadioChange}
      />
      <MyRadioButton
        label="Option 2"
        value="option2"
        checked={false}
        onChange={handleRadioChange}
      />
    </>
  );
};

export default Example;
