interface BaseExpression {
    type: string;
}

export interface ConstantExpression<T> extends BaseExpression {
    type: 'constant';
    value: T;
}

export interface RandomOptionExpression<T> {
    type: 'randomOption';
    values: Expression<T>[];
}

export type Expression<T> = ConstantExpression<T> | RandomOptionExpression<T>;
