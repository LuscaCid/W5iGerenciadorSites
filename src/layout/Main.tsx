import { Outlet } from "react-router-dom";

/**
 * @summary Este componente tsx vai estabelecer o layout em relacao ao header e footer 
 * @author Lucas Cid
 * @created 27/02/2025
 */
export function Main () 
{
    return (
        <body>
            {/*header  */}
            <main>
                <Outlet />
            </main>
            {/*footer  */}
        </body>
    );
}