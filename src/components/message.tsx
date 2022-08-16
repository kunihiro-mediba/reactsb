import { atom, useRecoilState, useRecoilValue } from "recoil";

const messageAtom = atom<string>({
    key: "message",
    default: "Hello,World!",
});

export function Message() {
    const message = useRecoilValue(messageAtom);

    return <div>{message}</div>;
}

export function MessageInput() {
    const [message, setMessage] = useRecoilState(messageAtom);

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                }}
            />
        </div>
    );
}
