import {validateForm} from "../validateForm";
import {getObjectMeta, getTextMeta} from "../../helpers";
import {required} from "../rules";

describe('validateForm', () => {

    it('should validate empty fields', () => {
        expect(validateForm({ random: 'X' }, [])).toEqual({})
    })


    it('should validate simple Text fields', () => {
        const fields = [
            getTextMeta({ name: "a", validation: [required("a is required")] }),
            getTextMeta({ name: "b", validation: [required("b is required")] }),
            getTextMeta({ name: "c", validation: [required("c is required")] }),
        ]
        expect(validateForm({ b: 'B' }, fields)).toEqual({ a: "a is required", c: "c is required"})
    })

    it('should validate array Text fields', () => {
        const fields = [
            getTextMeta({name: "a", validation: [required("a is required")], array: true}),
            getTextMeta({name: "b", validation: [required("b is required")], array: true}),
            getTextMeta({name: "c", validation: [required("c is required")], array: true}),
        ]
        expect(validateForm({ b: [], c: [undefined, null, 'C3', null] }, fields)).toEqual({ a: ["a is required"], b: ["b is required"], c: ["c is required", "c is required", undefined, "c is required"]})
    })

    describe('object field', ()=>{
        const fields = [
            getObjectMeta({ name: "a", validation: [required("a is required")], fields: [
                getTextMeta({ name: "a1", validation: [required("a1 is required")] }),
                getTextMeta({ name: "a2", validation: [required("a2 is required")] })
            ]}),
        ]

        it('should validate object field and set error on main field when contains error', () => {
            expect(validateForm({}, fields)).toEqual({ a: 'a is required' })
        })

        it('should validate object field and set error on children fields', () => {
            expect(validateForm({ a: { a1: 'a value' }}, fields)).toEqual({ a: { a2: 'a2 is required'} })
        })

        it('should validate Object field which is array as well', () => {
            const fields = [
                getObjectMeta({ name: "a", validation: [required("a is required")], fields: [
                        getTextMeta({ name: "a1", validation: [required("a1 is required")] }),
                        getTextMeta({ name: "a2", validation: [required("a2 is required")] })
                    ], array: true }),
            ]
            // todo" tohle je mozna blbe
            expect(validateForm({a: [{a2: 'sem tu'}]}, fields)).toEqual({
                a: [{ a1: "a1 is required", }, undefined]
            })
        })
    })
})