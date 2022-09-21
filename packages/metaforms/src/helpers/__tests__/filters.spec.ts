import { getTextFilter } from '../filters';

describe('filters', () => {
  describe('getTextFilter', () => {
    it('gets string filter without value, label and submit', () => {
      expect(getTextFilter()).toEqual([
        {
          'name': 'value',
          'type': 'text'
        },
        {
          'fields': [
            {
              'control': 'button',
              'id': 'reset',
              'label': 'Reset',
              'name': 'reset',
              'type': 'action'
            },
            {
              'label': 'Filtrovat',
              'name': 'submit',
              'type': 'submit'
            }
          ],
          'name': '',
          'render': 'horizontal',
          'type': 'layout'
        }
      ]);
    });

    it('gets string filter', async () => {
      expect(
        getTextFilter({
          label: 'Customer id',
        }),
      ).toEqual([
        {
          'label': 'Customer id',
          'name': 'value',
          'type': 'text'
        },
        {
          'fields': [
            {
              'control': 'button',
              'id': 'reset',
              'label': 'Reset',
              'name': 'reset',
              'type': 'action'
            },
            {
              'label': 'Filtrovat',
              'name': 'submit',
              'type': 'submit'
            }
          ],
          'name': '',
          'render': 'horizontal',
          'type': 'layout'
        }
      ]);
    });

    it('gets string filter with select options', async () => {
      expect(
        getTextFilter({
          label: 'Customer id',
          withOperator: true
        }),
      ).toEqual([
        {
          'label': 'Customer id',
          'name': 'value',
          'type': 'text'
        },
        {
          'name': 'operator',
          'options': [
            {
              'label': 'Přesná shoda',
              'value': 'EQ'
            },
            {
              'label': 'Fulltext',
              'value': 'LIKE'
            }
          ],
          'type': 'select'
        },
        {
          'fields': [
            {
              'control': 'button',
              'id': 'reset',
              'label': 'Reset',
              'name': 'reset',
              'type': 'action'
            },
            {
              'label': 'Filtrovat',
              'name': 'submit',
              'type': 'submit'
            }
          ],
          'name': '',
          'render': 'horizontal',
          'type': 'layout'
        }
      ]);
    });
  });
});
