interface BaseExpression {
    type: string;
}

interface ConstantExpression<T> extends BaseExpression {
    type: 'constant';
    value: T;
}

interface RandomOptionExpression<T> {
    type: 'randomOption';
    values: Expression<T>[];
}

export type Expression<T> = ConstantExpression<T> | RandomOptionExpression<T>;