import { CreateSlrModelTable1724971793382 } from './1724971793382-create-slr-model-table';
import { SplitSrlDataToOwnTable1724976029511 } from './1724976029511-split-srl-data-to-own-table';
import { ChangeSlrTables1724978312741 } from './1724978312741-change-slr-tables';
import { ChangeDataToSimpleArray1724981035062 } from './1724981035062-change-data-to-simple-array';
import { ChangeSlrModelNumericFieldsToDouble1724981929094 } from './1724981929094-change-slr-model-numeric-fields-to-double';

export const migrations = [
  CreateSlrModelTable1724971793382,
  SplitSrlDataToOwnTable1724976029511,
  ChangeSlrTables1724978312741,
  ChangeDataToSimpleArray1724981035062,
  ChangeSlrModelNumericFieldsToDouble1724981929094,
];
