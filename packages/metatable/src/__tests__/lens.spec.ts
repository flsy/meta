import { setNestedData } from '../tools';

describe('lens', () => {
  it('works', async () => {
    expect(setNestedData(['first'], 5, { existing: 4 })).toEqual({ first: 5, existing: 4 })
    expect(setNestedData(['first'], 5, {})).toEqual({ first: 5})
    expect(setNestedData(['first', 'second', 'third', 'fourth'], 1, {})).toEqual({ first: { second: {third: {fourth: 1}}}})
    expect(setNestedData(['first', 'second', 'third'], 3, { id: 5 })).toEqual({ first: { second: { third: 3 }}, id: 5})
    expect(setNestedData(['first', 'second', 'third'], 3, { first: { nested: 9} })).toEqual({ first: { second: { third: 3 }, nested: 9}})
  })


  // it('ok', () => {
  //
  //   const persons: IColumn = [
  //     { type: "number", path: ["id"], label: 'ID', key: true, },
  //     { type: "string", path: ["lastName"], label: 'Last name' },
  //     { type: "string", path: ["firstName"],label: 'First name' },
  //     { type: "number", path: ["age"], label: 'Age' },
  //     { type: "boolean", path: ["isArchived"], label: 'Is archived' },
  //     { type: "number", path: ["train", "number"], label: 'Train number' },
  //     { type: "string", path: ["train", "name"], label: 'Train name' },
  //     { type: "number", path: ["train", "id", "honza"], label: 'Train id' },
  //   ]
  //
  //
  //
  //   expect(toTree(persons)).toEqual({
  //     age: {
  //       label: "Age",
  //       type: "number"
  //     },
  //     firstName: {
  //       label: "First name",
  //       type: "string"
  //     },
  //     id: {
  //       key: true,
  //       label: "ID",
  //       type: "number"
  //     },
  //     isArchived: {
  //       label: "Is archived",
  //       type: "boolean"
  //     },
  //     lastName: {
  //       label: "Last name",
  //       type: "string"
  //     },
  //     train: {
  //       id: {
  //         honza: {
  //           label: "Train id",
  //           type: "number"
  //         }
  //       },
  //       name: {
  //         label: "Train name",
  //         type: "string"
  //       },
  //       number: {
  //         label: "Train number",
  //         type: "number"
  //       }
  //     }
  //   })
  //
  // })
})
