import * as React from 'react';
import { unionEdit } from '../components/edit/UnionEdit';
import { objectEdit } from '../components/edit/ObjectEdit';
import { ConstantExpression, Expression, RandomOptionExpression } from '../../../server/src/Expressions';
import { TextEdit } from '../components/edit/TextEdit';
import { arrayEdit } from '../components/edit/ArrayEdit';
import { EditComponent } from '../components/edit/Edit';

const DEFAULT_EXPRESSION: ConstantExpression<string> = { type: 'constant', value: '' };

export const StringExpressionEdit = unionEdit<Expression<string>>({
    constant: {
        component: (() => objectEdit<ConstantExpression<string>>({
            value: { component: TextEdit }
        })),
        defaultValue: DEFAULT_EXPRESSION
    },
    randomOption: {
        component: (() => RandomOptionStringExpressionEdit),
        defaultValue: { type: 'randomOption', values: [DEFAULT_EXPRESSION] }
    }
});

const RandomOptionStringExpressionEdit: EditComponent<RandomOptionExpression<string>> = objectEdit<RandomOptionExpression<string>>({
    values: { component: arrayEdit<Expression<string>>(DEFAULT_EXPRESSION, StringExpressionEdit) }
});
