import React from "react";
import { SplitButton } from "@dhis2/ui";
import FlyoutMenuComponent from "../menu/FlyoutMenu.js";
import { DropdownButtonProps } from "../../types/buttons/DropdownButtonTypes.js";
import { Tooltip } from "@material-ui/core";
import { useParams } from "../../hooks/index.js";

function DropdownButtonComponent(props: DropdownButtonProps): React.ReactElement {
  const { name, icon, options, disabled } = props;
  const { urlParamiters } = useParams();
  const { grade, class: section } = urlParamiters()
  const msg = (!grade && !section) ? "Please select grade and class/section" : !grade ? "Please select grade" : !section ? "Please select class/section" : ""

  return (
    <Tooltip title={msg} disableHoverListener={!disabled}>
      <div>
        <SplitButton
          disabled={disabled}
          icon={icon}
          component={<FlyoutMenuComponent options={options} />}
        >
          {name}
        </SplitButton>
      </div>
    </Tooltip>
  );
}

export default DropdownButtonComponent;
