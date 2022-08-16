import { ReactElement } from "react";
import { RecoilRoot } from "recoil";

import { Message, MessageInput } from "./components/message";

export function App(): ReactElement {
    return (
        <RecoilRoot>
            <Message />
            <MessageInput />
        </RecoilRoot>
    );
}
