namespace ConstAssertion {
  let a = "GET"
  const b = "GET"
}
const HTTPRequestMethod = {
  CONNECT: "CONNECT",
  DELETE: "DELETE",
  GET: "GET",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT",
  TRACE: "TRACE"
};

// const HTTPRequestMethod: {
//   CONNECT: string;
//   DELETE: string;
//   GET: string;
//   HEAD: string;
//   OPTIONS: string;
//   PATCH: string;
//   POST: string;
//   PUT: string;
//   TRACE: string;
// }

const HTTPRequestMethod = {
  CONNECT: "CONNECT" as "CONNECT",
  DELETE: "DELETE" as "DELETE",
  GET: "GET" as "GET",
  HEAD: "HEAD" as "HEAD",
  OPTIONS: "OPTIONS" as "OPTIONS",
  PATCH: "PATCH" as "PATCH",
  POST: "POST" as "POST",
  PUT: "PUT" as "PUT",
  TRACE: "TRACE" as "TRACE"
};

const HTTPRequestMethod = {
  CONNECT: "CONNECT",
  DELETE: "DELETE",
  GET: "GET",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT",
  TRACE: "TRACE"
} as const;
