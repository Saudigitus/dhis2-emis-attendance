import React from "react";
import { SplitButton } from "@dhis2/ui";
import FlyoutMenuComponent from "../menu/FlyoutMenu.js";
import { DropdownButtonProps } from "../../types/buttons/DropdownButtonTypes.js";


function DropdownButtonComponent(props: DropdownButtonProps): React.ReactElement {
  const { name, icon, options, disabled } = props;

  return (
    <SplitButton
      disabled={disabled}
      icon={icon}
      component={<FlyoutMenuComponent options={options} />}
    >
      {name}
    </SplitButton>
  );
}

export default DropdownButtonComponent;
