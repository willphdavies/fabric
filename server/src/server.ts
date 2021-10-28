import Hapi from "@hapi/hapi";
import inert from "@hapi/inert";
import Jwt from "@hapi/jwt";
import Path from "path";
import { Server } from "@hapi/hapi";

export let server: Server;

const secret = "some_shared_secret";
const basePath = Path.resolve(__dirname, "..", "..");
const staticFiles = `${Path.resolve(__dirname, "..", "..", "build")}/`;

export const init = async function (): Promise<Server> {
  server = Hapi.server({
    port: 4000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: Path.join(__dirname, "..", "..", "build"),
      },
    },
  });
  await server.register(inert);
  await server.register(Jwt);

  server.auth.strategy("jwt", "jwt", {
    keys: secret,
    verify: false,
    validate: (artifacts, request, h) => {
      if (artifacts.decoded.payload.username === "Fabric") {
        return {
          isValid: true,
          credentials: { user: artifacts.decoded.payload.user },
        };
      }
      return {
        isValid: false,
      };
    },
  });

  server.auth.default("jwt");

  // Routes will go here

  server.route([
    {
      method: "POST",
      path: "/api/authenticate",
      handler: function (request, h) {
        if (request.payload) {
          const params = (request.payload as any).params || {};
          if (params.username === "Fabric" && params.password === "password1") {
            const tokenData = {
              username: params.username,
            };
            return h.response({
              success: true,
              token: Jwt.token.generate(tokenData, secret),
            });
          }
        }
        return h.response({ success: false, message: "invalid credentials" });
      },
      options: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/api/user/me",
      handler: function (request, h) {
        if (request.auth.artifacts.decoded) {
          const response = h.response({
            success: true,
            result: {
              username: (request.auth.artifacts.decoded as any).payload
                .username,
              applicationPath: basePath,
              currentTime: new Date().toString(),
            },
          });
          response.header("Authorization", request.headers.authorization);
          return response;
        }
        return h.response({ success: false }).code(500);
      },
      options: {
        auth: "jwt",
      },
    },
    {
      method: "GET",
      path: "/{file*}",
      handler: {
        directory: {
          path: staticFiles,
        },
      },
      options: {
        auth: false,
      },
    },
  ]);

  return server;
};

export const start = async function (): Promise<void> {
  console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
  return server.start();
};

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection");
  console.error(err);
  process.exit(1);
});
