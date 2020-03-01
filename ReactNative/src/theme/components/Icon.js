// @flow

import { black } from '../variables/commonColor';
import variable from '../variables/platform';

export default (variables /* : * */ = variable) => {
  const iconTheme = {
    fontSize: variables.iconFontSize,
    color: black,
  };

  return iconTheme;
};
