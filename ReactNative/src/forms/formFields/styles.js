import { brand, redA700 } from '../../theme/variables/commonColor';

export default {
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewSelect: { height: 40 },
  viewSelectContainer: { top: -9 },
  viewSelectLabel: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  viewSelectLabelBorder: { borderBottomWidth: 0.7 },
  viewSelectIcon: {
    fontSize: 10,
    marginTop: 3,
    color: brand,
  },
  select: {
    fontSize: 12,
    height: 15 * 1.1,
  },
  defaultItem: {
    flex: 1,
  },
  fieldVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 80,
  },
  labelVertical: {
    paddingHorizontal: 5,
  },
  fieldHorizontal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 0.5,
    borderBottomColor: brand,
    marginVertical: 2,
    height: 40,
  },
  borderColorError: { borderBottomColor: redA700 },
  labelDefault: {
    fontSize: 9,
    left: 4,
    color: brand,
  },
  input: {
    top: 8,
    height: 40,
    fontSize: 12,
    color: brand,
    borderColor: brand,
  },
  icon: {
    fontSize: 17,
    color: brand,
    marginBottom: 4,
    marginRight: 1,
  },
  labelError: {
    fontSize: 9,
    color: redA700,
    textAlign: 'right',
  },
};
