import * as React from 'react';


type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button: React.FunctionComponent<Props> = ({ children, ...rest }) => (
    <button {...rest}>
        <table className="button">
            <tbody>
            <tr>
                <td className="button-left"/>
                <td className="button-middle">
                    {children}
                </td>
                <td className="button-right"/>
            </tr>
            </tbody>
        </table>
    </button>
);