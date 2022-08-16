import { createServer, IncomingMessage } from "node:http";

import { buildSchema, graphql, print } from "graphql";
import gql from "graphql-tag";

const typedef = gql`
    type Query {
        "Get message"
        message: String!
    }
`;

const rootValue = {
    message() {
        return "Hello,World!";
    },
    foo() {
        throw new Error("foo error");
    },
};

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise<string>((resolve) => {
        let body = "";
        req.on("readable", () => {
            const read = req.read();
            if (read) {
                body += read;
            }
        });
        req.on("end", () => {
            resolve(body);
        });
    });
}

async function main() {
    const schema = buildSchema(print(typedef));
    const server = createServer(async (req, res) => {
        const { method, url } = req;
        const { pathname } = new URL(url!, "http://localhost:8080");
        console.log(`${new Date().toISOString()} ${method} ${pathname}`);
        if (pathname === "/graphql") {
            if (method === "POST") {
                let body = await readBody(req);
                const { operationName, query, variables } = JSON.parse(body);
                const result = await graphql({
                    schema,
                    source: query,
                    rootValue,
                    variableValues: variables,
                    operationName,
                });
                // response
                res.setHeader("Access-Control-Allow-Origin", "*")
                    .setHeader("Access-Control-Allow-Headers", "*")
                    .setHeader("Content-Type", "application/json")
                    .writeHead(200)
                    .write(JSON.stringify(result), () => {
                        res.end();
                    });
                return;
            } else if (method === "OPTIONS") {
                res.setHeader("Access-Control-Allow-Origin", "*")
                    .setHeader("Access-Control-Allow-Headers", "*")
                    .writeHead(200)
                    .end();
                return;
            }
        }
        res.setHeader("Content-Type", "application/json").writeHead(200).write(JSON.stringify({ method, pathname }));
    });
    server.listen(8080);
    console.log(`start server http://localhost:8080`);
}

if (require.main === module) {
    main();
}
