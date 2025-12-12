
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Ticket
 * 
 */
export type Ticket = $Result.DefaultSelection<Prisma.$TicketPayload>
/**
 * Model CustomerHistory
 * 
 */
export type CustomerHistory = $Result.DefaultSelection<Prisma.$CustomerHistoryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  superadmin: 'superadmin',
  admin: 'admin',
  sales: 'sales',
  auditor: 'auditor',
  operation: 'operation'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Sex: {
  Male: 'Male',
  Female: 'Female'
};

export type Sex = (typeof Sex)[keyof typeof Sex]


export const TicketStatus: {
  Sent: 'Sent',
  Failed: 'Failed'
};

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus]


export const HistoryEventType: {
  ticket: 'ticket'
};

export type HistoryEventType = (typeof HistoryEventType)[keyof typeof HistoryEventType]


export const AuditStatus: {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Voided: 'Voided'
};

export type AuditStatus = (typeof AuditStatus)[keyof typeof AuditStatus]


export const PaymentMode: {
  CASH: 'CASH',
  BANK: 'BANK'
};

export type PaymentMode = (typeof PaymentMode)[keyof typeof PaymentMode]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Sex = $Enums.Sex

export const Sex: typeof $Enums.Sex

export type TicketStatus = $Enums.TicketStatus

export const TicketStatus: typeof $Enums.TicketStatus

export type HistoryEventType = $Enums.HistoryEventType

export const HistoryEventType: typeof $Enums.HistoryEventType

export type AuditStatus = $Enums.AuditStatus

export const AuditStatus: typeof $Enums.AuditStatus

export type PaymentMode = $Enums.PaymentMode

export const PaymentMode: typeof $Enums.PaymentMode

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customerHistory`: Exposes CRUD operations for the **CustomerHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerHistories
    * const customerHistories = await prisma.customerHistory.findMany()
    * ```
    */
  get customerHistory(): Prisma.CustomerHistoryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Customer: 'Customer',
    Ticket: 'Ticket',
    CustomerHistory: 'CustomerHistory'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "customer" | "ticket" | "customerHistory"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Ticket: {
        payload: Prisma.$TicketPayload<ExtArgs>
        fields: Prisma.TicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findFirst: {
            args: Prisma.TicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findMany: {
            args: Prisma.TicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          create: {
            args: Prisma.TicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          createMany: {
            args: Prisma.TicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          update: {
            args: Prisma.TicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          deleteMany: {
            args: Prisma.TicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          aggregate: {
            args: Prisma.TicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicket>
          }
          groupBy: {
            args: Prisma.TicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketCountArgs<ExtArgs>
            result: $Utils.Optional<TicketCountAggregateOutputType> | number
          }
        }
      }
      CustomerHistory: {
        payload: Prisma.$CustomerHistoryPayload<ExtArgs>
        fields: Prisma.CustomerHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload>
          }
          findFirst: {
            args: Prisma.CustomerHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload>
          }
          findMany: {
            args: Prisma.CustomerHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload>[]
          }
          create: {
            args: Prisma.CustomerHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload>
          }
          createMany: {
            args: Prisma.CustomerHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CustomerHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload>
          }
          update: {
            args: Prisma.CustomerHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload>
          }
          deleteMany: {
            args: Prisma.CustomerHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerHistoryPayload>
          }
          aggregate: {
            args: Prisma.CustomerHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerHistory>
          }
          groupBy: {
            args: Prisma.CustomerHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerHistoryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    customer?: CustomerOmit
    ticket?: TicketOmit
    customerHistory?: CustomerHistoryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    tickets: number
    customers: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tickets?: boolean | UserCountOutputTypeCountTicketsArgs
    customers?: boolean | UserCountOutputTypeCountCustomersArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCustomersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    tickets: number
    history: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tickets?: boolean | CustomerCountOutputTypeCountTicketsArgs
    history?: boolean | CustomerCountOutputTypeCountHistoryArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerHistoryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    ticketNumberStart: number | null
    ticketNumberEnd: number | null
    currentTicketNumber: number | null
    failedLoginAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    ticketNumberStart: number | null
    ticketNumberEnd: number | null
    currentTicketNumber: number | null
    failedLoginAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    branchId: string | null
    ticketNumberStart: number | null
    ticketNumberEnd: number | null
    currentTicketNumber: number | null
    isActive: boolean | null
    failedLoginAttempts: number | null
    isLocked: boolean | null
    lockedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    branchId: string | null
    ticketNumberStart: number | null
    ticketNumberEnd: number | null
    currentTicketNumber: number | null
    isActive: boolean | null
    failedLoginAttempts: number | null
    isLocked: boolean | null
    lockedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    branchId: number
    ticketNumberStart: number
    ticketNumberEnd: number
    currentTicketNumber: number
    isActive: number
    failedLoginAttempts: number
    isLocked: number
    lockedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    ticketNumberStart?: true
    ticketNumberEnd?: true
    currentTicketNumber?: true
    failedLoginAttempts?: true
  }

  export type UserSumAggregateInputType = {
    ticketNumberStart?: true
    ticketNumberEnd?: true
    currentTicketNumber?: true
    failedLoginAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    branchId?: true
    ticketNumberStart?: true
    ticketNumberEnd?: true
    currentTicketNumber?: true
    isActive?: true
    failedLoginAttempts?: true
    isLocked?: true
    lockedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    branchId?: true
    ticketNumberStart?: true
    ticketNumberEnd?: true
    currentTicketNumber?: true
    isActive?: true
    failedLoginAttempts?: true
    isLocked?: true
    lockedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    branchId?: true
    ticketNumberStart?: true
    ticketNumberEnd?: true
    currentTicketNumber?: true
    isActive?: true
    failedLoginAttempts?: true
    isLocked?: true
    lockedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart: number | null
    ticketNumberEnd: number | null
    currentTicketNumber: number | null
    isActive: boolean
    failedLoginAttempts: number
    isLocked: boolean
    lockedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    branchId?: boolean
    ticketNumberStart?: boolean
    ticketNumberEnd?: boolean
    currentTicketNumber?: boolean
    isActive?: boolean
    failedLoginAttempts?: boolean
    isLocked?: boolean
    lockedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tickets?: boolean | User$ticketsArgs<ExtArgs>
    customers?: boolean | User$customersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    branchId?: boolean
    ticketNumberStart?: boolean
    ticketNumberEnd?: boolean
    currentTicketNumber?: boolean
    isActive?: boolean
    failedLoginAttempts?: boolean
    isLocked?: boolean
    lockedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "branchId" | "ticketNumberStart" | "ticketNumberEnd" | "currentTicketNumber" | "isActive" | "failedLoginAttempts" | "isLocked" | "lockedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tickets?: boolean | User$ticketsArgs<ExtArgs>
    customers?: boolean | User$customersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tickets: Prisma.$TicketPayload<ExtArgs>[]
      customers: Prisma.$CustomerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string | null
      role: $Enums.Role
      branchId: string
      ticketNumberStart: number | null
      ticketNumberEnd: number | null
      currentTicketNumber: number | null
      isActive: boolean
      failedLoginAttempts: number
      isLocked: boolean
      lockedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tickets<T extends User$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, User$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    customers<T extends User$customersArgs<ExtArgs> = {}>(args?: Subset<T, User$customersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly branchId: FieldRef<"User", 'String'>
    readonly ticketNumberStart: FieldRef<"User", 'Int'>
    readonly ticketNumberEnd: FieldRef<"User", 'Int'>
    readonly currentTicketNumber: FieldRef<"User", 'Int'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly failedLoginAttempts: FieldRef<"User", 'Int'>
    readonly isLocked: FieldRef<"User", 'Boolean'>
    readonly lockedAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.tickets
   */
  export type User$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * User.customers
   */
  export type User$customersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    cursor?: CustomerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    sex: $Enums.Sex | null
    phoneNumber: string | null
    address: string | null
    payersIdentification: string | null
    savingType: string | null
    loanType: string | null
    registrationDate: string | null
    isActive: boolean | null
    createdAt: Date | null
    registeredBy: string | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    sex: $Enums.Sex | null
    phoneNumber: string | null
    address: string | null
    payersIdentification: string | null
    savingType: string | null
    loanType: string | null
    registrationDate: string | null
    isActive: boolean | null
    createdAt: Date | null
    registeredBy: string | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    fullName: number
    sex: number
    phoneNumber: number
    address: number
    payersIdentification: number
    savingType: number
    loanType: number
    registrationDate: number
    isActive: number
    createdAt: number
    registeredBy: number
    _all: number
  }


  export type CustomerMinAggregateInputType = {
    id?: true
    fullName?: true
    sex?: true
    phoneNumber?: true
    address?: true
    payersIdentification?: true
    savingType?: true
    loanType?: true
    registrationDate?: true
    isActive?: true
    createdAt?: true
    registeredBy?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    fullName?: true
    sex?: true
    phoneNumber?: true
    address?: true
    payersIdentification?: true
    savingType?: true
    loanType?: true
    registrationDate?: true
    isActive?: true
    createdAt?: true
    registeredBy?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    fullName?: true
    sex?: true
    phoneNumber?: true
    address?: true
    payersIdentification?: true
    savingType?: true
    loanType?: true
    registrationDate?: true
    isActive?: true
    createdAt?: true
    registeredBy?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive: boolean
    createdAt: Date
    registeredBy: string
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    sex?: boolean
    phoneNumber?: boolean
    address?: boolean
    payersIdentification?: boolean
    savingType?: boolean
    loanType?: boolean
    registrationDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    registeredBy?: boolean
    registeredByUser?: boolean | Customer$registeredByUserArgs<ExtArgs>
    tickets?: boolean | Customer$ticketsArgs<ExtArgs>
    history?: boolean | Customer$historyArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>



  export type CustomerSelectScalar = {
    id?: boolean
    fullName?: boolean
    sex?: boolean
    phoneNumber?: boolean
    address?: boolean
    payersIdentification?: boolean
    savingType?: boolean
    loanType?: boolean
    registrationDate?: boolean
    isActive?: boolean
    createdAt?: boolean
    registeredBy?: boolean
  }

  export type CustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "sex" | "phoneNumber" | "address" | "payersIdentification" | "savingType" | "loanType" | "registrationDate" | "isActive" | "createdAt" | "registeredBy", ExtArgs["result"]["customer"]>
  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    registeredByUser?: boolean | Customer$registeredByUserArgs<ExtArgs>
    tickets?: boolean | Customer$ticketsArgs<ExtArgs>
    history?: boolean | Customer$historyArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      registeredByUser: Prisma.$UserPayload<ExtArgs> | null
      tickets: Prisma.$TicketPayload<ExtArgs>[]
      history: Prisma.$CustomerHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      sex: $Enums.Sex
      phoneNumber: string
      address: string | null
      payersIdentification: string
      savingType: string
      loanType: string
      registrationDate: string
      isActive: boolean
      createdAt: Date
      registeredBy: string
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    registeredByUser<T extends Customer$registeredByUserArgs<ExtArgs> = {}>(args?: Subset<T, Customer$registeredByUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tickets<T extends Customer$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    history<T extends Customer$historyArgs<ExtArgs> = {}>(args?: Subset<T, Customer$historyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly fullName: FieldRef<"Customer", 'String'>
    readonly sex: FieldRef<"Customer", 'Sex'>
    readonly phoneNumber: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly payersIdentification: FieldRef<"Customer", 'String'>
    readonly savingType: FieldRef<"Customer", 'String'>
    readonly loanType: FieldRef<"Customer", 'String'>
    readonly registrationDate: FieldRef<"Customer", 'String'>
    readonly isActive: FieldRef<"Customer", 'Boolean'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly registeredBy: FieldRef<"Customer", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to delete.
     */
    limit?: number
  }

  /**
   * Customer.registeredByUser
   */
  export type Customer$registeredByUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Customer.tickets
   */
  export type Customer$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Customer.history
   */
  export type Customer$historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    where?: CustomerHistoryWhereInput
    orderBy?: CustomerHistoryOrderByWithRelationInput | CustomerHistoryOrderByWithRelationInput[]
    cursor?: CustomerHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerHistoryScalarFieldEnum | CustomerHistoryScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Ticket
   */

  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketAvgAggregateOutputType = {
    paymentAmount: number | null
  }

  export type TicketSumAggregateOutputType = {
    paymentAmount: number | null
  }

  export type TicketMinAggregateOutputType = {
    id: string | null
    customerName: string | null
    customerPhone: string | null
    paymentAmount: number | null
    status: $Enums.TicketStatus | null
    date: string | null
    reasonForPayment: string | null
    preparedBy: string | null
    ticketNumber: string | null
    modeOfPayment: $Enums.PaymentMode | null
    bankReceiptNo: string | null
    htmlContent: string | null
    createdAt: Date | null
    auditStatus: $Enums.AuditStatus | null
    auditedBy: string | null
    auditedAt: Date | null
    auditNote: string | null
  }

  export type TicketMaxAggregateOutputType = {
    id: string | null
    customerName: string | null
    customerPhone: string | null
    paymentAmount: number | null
    status: $Enums.TicketStatus | null
    date: string | null
    reasonForPayment: string | null
    preparedBy: string | null
    ticketNumber: string | null
    modeOfPayment: $Enums.PaymentMode | null
    bankReceiptNo: string | null
    htmlContent: string | null
    createdAt: Date | null
    auditStatus: $Enums.AuditStatus | null
    auditedBy: string | null
    auditedAt: Date | null
    auditNote: string | null
  }

  export type TicketCountAggregateOutputType = {
    id: number
    customerName: number
    customerPhone: number
    paymentAmount: number
    status: number
    date: number
    reasonForPayment: number
    preparedBy: number
    ticketNumber: number
    modeOfPayment: number
    bankReceiptNo: number
    htmlContent: number
    createdAt: number
    auditStatus: number
    auditedBy: number
    auditedAt: number
    auditNote: number
    _all: number
  }


  export type TicketAvgAggregateInputType = {
    paymentAmount?: true
  }

  export type TicketSumAggregateInputType = {
    paymentAmount?: true
  }

  export type TicketMinAggregateInputType = {
    id?: true
    customerName?: true
    customerPhone?: true
    paymentAmount?: true
    status?: true
    date?: true
    reasonForPayment?: true
    preparedBy?: true
    ticketNumber?: true
    modeOfPayment?: true
    bankReceiptNo?: true
    htmlContent?: true
    createdAt?: true
    auditStatus?: true
    auditedBy?: true
    auditedAt?: true
    auditNote?: true
  }

  export type TicketMaxAggregateInputType = {
    id?: true
    customerName?: true
    customerPhone?: true
    paymentAmount?: true
    status?: true
    date?: true
    reasonForPayment?: true
    preparedBy?: true
    ticketNumber?: true
    modeOfPayment?: true
    bankReceiptNo?: true
    htmlContent?: true
    createdAt?: true
    auditStatus?: true
    auditedBy?: true
    auditedAt?: true
    auditNote?: true
  }

  export type TicketCountAggregateInputType = {
    id?: true
    customerName?: true
    customerPhone?: true
    paymentAmount?: true
    status?: true
    date?: true
    reasonForPayment?: true
    preparedBy?: true
    ticketNumber?: true
    modeOfPayment?: true
    bankReceiptNo?: true
    htmlContent?: true
    createdAt?: true
    auditStatus?: true
    auditedBy?: true
    auditedAt?: true
    auditNote?: true
    _all?: true
  }

  export type TicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TicketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TicketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithAggregationInput | TicketOrderByWithAggregationInput[]
    by: TicketScalarFieldEnum[] | TicketScalarFieldEnum
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _avg?: TicketAvgAggregateInputType
    _sum?: TicketSumAggregateInputType
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }

  export type TicketGroupByOutputType = {
    id: string
    customerName: string
    customerPhone: string | null
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment: string | null
    preparedBy: string
    ticketNumber: string
    modeOfPayment: $Enums.PaymentMode | null
    bankReceiptNo: string | null
    htmlContent: string | null
    createdAt: Date
    auditStatus: $Enums.AuditStatus
    auditedBy: string | null
    auditedAt: Date | null
    auditNote: string | null
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerName?: boolean
    customerPhone?: boolean
    paymentAmount?: boolean
    status?: boolean
    date?: boolean
    reasonForPayment?: boolean
    preparedBy?: boolean
    ticketNumber?: boolean
    modeOfPayment?: boolean
    bankReceiptNo?: boolean
    htmlContent?: boolean
    createdAt?: boolean
    auditStatus?: boolean
    auditedBy?: boolean
    auditedAt?: boolean
    auditNote?: boolean
    preparedByUser?: boolean | Ticket$preparedByUserArgs<ExtArgs>
    customer?: boolean | Ticket$customerArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>



  export type TicketSelectScalar = {
    id?: boolean
    customerName?: boolean
    customerPhone?: boolean
    paymentAmount?: boolean
    status?: boolean
    date?: boolean
    reasonForPayment?: boolean
    preparedBy?: boolean
    ticketNumber?: boolean
    modeOfPayment?: boolean
    bankReceiptNo?: boolean
    htmlContent?: boolean
    createdAt?: boolean
    auditStatus?: boolean
    auditedBy?: boolean
    auditedAt?: boolean
    auditNote?: boolean
  }

  export type TicketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerName" | "customerPhone" | "paymentAmount" | "status" | "date" | "reasonForPayment" | "preparedBy" | "ticketNumber" | "modeOfPayment" | "bankReceiptNo" | "htmlContent" | "createdAt" | "auditStatus" | "auditedBy" | "auditedAt" | "auditNote", ExtArgs["result"]["ticket"]>
  export type TicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    preparedByUser?: boolean | Ticket$preparedByUserArgs<ExtArgs>
    customer?: boolean | Ticket$customerArgs<ExtArgs>
  }

  export type $TicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ticket"
    objects: {
      preparedByUser: Prisma.$UserPayload<ExtArgs> | null
      customer: Prisma.$CustomerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerName: string
      customerPhone: string | null
      paymentAmount: number
      status: $Enums.TicketStatus
      date: string
      reasonForPayment: string | null
      preparedBy: string
      ticketNumber: string
      modeOfPayment: $Enums.PaymentMode | null
      bankReceiptNo: string | null
      htmlContent: string | null
      createdAt: Date
      auditStatus: $Enums.AuditStatus
      auditedBy: string | null
      auditedAt: Date | null
      auditNote: string | null
    }, ExtArgs["result"]["ticket"]>
    composites: {}
  }

  type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = $Result.GetResult<Prisma.$TicketPayload, S>

  type TicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketCountAggregateInputType | true
    }

  export interface TicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ticket'], meta: { name: 'Ticket' } }
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketFindUniqueArgs>(args: SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ticket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketFindFirstArgs>(args?: SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketFindManyArgs>(args?: SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
     */
    create<T extends TicketCreateArgs>(args: SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tickets.
     * @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketCreateManyArgs>(args?: SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
     */
    delete<T extends TicketDeleteArgs>(args: SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketUpdateArgs>(args: SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketDeleteManyArgs>(args?: SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketUpdateManyArgs>(args: SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
     */
    upsert<T extends TicketUpsertArgs>(args: SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ticket model
   */
  readonly fields: TicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    preparedByUser<T extends Ticket$preparedByUserArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$preparedByUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    customer<T extends Ticket$customerArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ticket model
   */
  interface TicketFieldRefs {
    readonly id: FieldRef<"Ticket", 'String'>
    readonly customerName: FieldRef<"Ticket", 'String'>
    readonly customerPhone: FieldRef<"Ticket", 'String'>
    readonly paymentAmount: FieldRef<"Ticket", 'Float'>
    readonly status: FieldRef<"Ticket", 'TicketStatus'>
    readonly date: FieldRef<"Ticket", 'String'>
    readonly reasonForPayment: FieldRef<"Ticket", 'String'>
    readonly preparedBy: FieldRef<"Ticket", 'String'>
    readonly ticketNumber: FieldRef<"Ticket", 'String'>
    readonly modeOfPayment: FieldRef<"Ticket", 'PaymentMode'>
    readonly bankReceiptNo: FieldRef<"Ticket", 'String'>
    readonly htmlContent: FieldRef<"Ticket", 'String'>
    readonly createdAt: FieldRef<"Ticket", 'DateTime'>
    readonly auditStatus: FieldRef<"Ticket", 'AuditStatus'>
    readonly auditedBy: FieldRef<"Ticket", 'String'>
    readonly auditedAt: FieldRef<"Ticket", 'DateTime'>
    readonly auditNote: FieldRef<"Ticket", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Ticket findUnique
   */
  export type TicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findFirst
   */
  export type TicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket create
   */
  export type TicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }

  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ticket update
   */
  export type TicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
  }

  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }

  /**
   * Ticket delete
   */
  export type TicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to delete.
     */
    limit?: number
  }

  /**
   * Ticket.preparedByUser
   */
  export type Ticket$preparedByUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Ticket.customer
   */
  export type Ticket$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Ticket without action
   */
  export type TicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
  }


  /**
   * Model CustomerHistory
   */

  export type AggregateCustomerHistory = {
    _count: CustomerHistoryCountAggregateOutputType | null
    _avg: CustomerHistoryAvgAggregateOutputType | null
    _sum: CustomerHistorySumAggregateOutputType | null
    _min: CustomerHistoryMinAggregateOutputType | null
    _max: CustomerHistoryMaxAggregateOutputType | null
  }

  export type CustomerHistoryAvgAggregateOutputType = {
    amount: number | null
  }

  export type CustomerHistorySumAggregateOutputType = {
    amount: number | null
  }

  export type CustomerHistoryMinAggregateOutputType = {
    id: string | null
    eventType: $Enums.HistoryEventType | null
    amount: number | null
    ticketNumber: string | null
    date: string | null
    preparedBy: string | null
    reasonForPayment: string | null
    customerId: string | null
    createdAt: Date | null
  }

  export type CustomerHistoryMaxAggregateOutputType = {
    id: string | null
    eventType: $Enums.HistoryEventType | null
    amount: number | null
    ticketNumber: string | null
    date: string | null
    preparedBy: string | null
    reasonForPayment: string | null
    customerId: string | null
    createdAt: Date | null
  }

  export type CustomerHistoryCountAggregateOutputType = {
    id: number
    eventType: number
    amount: number
    ticketNumber: number
    date: number
    preparedBy: number
    reasonForPayment: number
    customerId: number
    createdAt: number
    _all: number
  }


  export type CustomerHistoryAvgAggregateInputType = {
    amount?: true
  }

  export type CustomerHistorySumAggregateInputType = {
    amount?: true
  }

  export type CustomerHistoryMinAggregateInputType = {
    id?: true
    eventType?: true
    amount?: true
    ticketNumber?: true
    date?: true
    preparedBy?: true
    reasonForPayment?: true
    customerId?: true
    createdAt?: true
  }

  export type CustomerHistoryMaxAggregateInputType = {
    id?: true
    eventType?: true
    amount?: true
    ticketNumber?: true
    date?: true
    preparedBy?: true
    reasonForPayment?: true
    customerId?: true
    createdAt?: true
  }

  export type CustomerHistoryCountAggregateInputType = {
    id?: true
    eventType?: true
    amount?: true
    ticketNumber?: true
    date?: true
    preparedBy?: true
    reasonForPayment?: true
    customerId?: true
    createdAt?: true
    _all?: true
  }

  export type CustomerHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerHistory to aggregate.
     */
    where?: CustomerHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerHistories to fetch.
     */
    orderBy?: CustomerHistoryOrderByWithRelationInput | CustomerHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerHistories
    **/
    _count?: true | CustomerHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerHistoryMaxAggregateInputType
  }

  export type GetCustomerHistoryAggregateType<T extends CustomerHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerHistory[P]>
      : GetScalarType<T[P], AggregateCustomerHistory[P]>
  }




  export type CustomerHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerHistoryWhereInput
    orderBy?: CustomerHistoryOrderByWithAggregationInput | CustomerHistoryOrderByWithAggregationInput[]
    by: CustomerHistoryScalarFieldEnum[] | CustomerHistoryScalarFieldEnum
    having?: CustomerHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerHistoryCountAggregateInputType | true
    _avg?: CustomerHistoryAvgAggregateInputType
    _sum?: CustomerHistorySumAggregateInputType
    _min?: CustomerHistoryMinAggregateInputType
    _max?: CustomerHistoryMaxAggregateInputType
  }

  export type CustomerHistoryGroupByOutputType = {
    id: string
    eventType: $Enums.HistoryEventType
    amount: number
    ticketNumber: string
    date: string
    preparedBy: string
    reasonForPayment: string | null
    customerId: string
    createdAt: Date
    _count: CustomerHistoryCountAggregateOutputType | null
    _avg: CustomerHistoryAvgAggregateOutputType | null
    _sum: CustomerHistorySumAggregateOutputType | null
    _min: CustomerHistoryMinAggregateOutputType | null
    _max: CustomerHistoryMaxAggregateOutputType | null
  }

  type GetCustomerHistoryGroupByPayload<T extends CustomerHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerHistoryGroupByOutputType[P]>
        }
      >
    >


  export type CustomerHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    amount?: boolean
    ticketNumber?: boolean
    date?: boolean
    preparedBy?: boolean
    reasonForPayment?: boolean
    customerId?: boolean
    createdAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerHistory"]>



  export type CustomerHistorySelectScalar = {
    id?: boolean
    eventType?: boolean
    amount?: boolean
    ticketNumber?: boolean
    date?: boolean
    preparedBy?: boolean
    reasonForPayment?: boolean
    customerId?: boolean
    createdAt?: boolean
  }

  export type CustomerHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventType" | "amount" | "ticketNumber" | "date" | "preparedBy" | "reasonForPayment" | "customerId" | "createdAt", ExtArgs["result"]["customerHistory"]>
  export type CustomerHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }

  export type $CustomerHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerHistory"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventType: $Enums.HistoryEventType
      amount: number
      ticketNumber: string
      date: string
      preparedBy: string
      reasonForPayment: string | null
      customerId: string
      createdAt: Date
    }, ExtArgs["result"]["customerHistory"]>
    composites: {}
  }

  type CustomerHistoryGetPayload<S extends boolean | null | undefined | CustomerHistoryDefaultArgs> = $Result.GetResult<Prisma.$CustomerHistoryPayload, S>

  type CustomerHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerHistoryCountAggregateInputType | true
    }

  export interface CustomerHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerHistory'], meta: { name: 'CustomerHistory' } }
    /**
     * Find zero or one CustomerHistory that matches the filter.
     * @param {CustomerHistoryFindUniqueArgs} args - Arguments to find a CustomerHistory
     * @example
     * // Get one CustomerHistory
     * const customerHistory = await prisma.customerHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerHistoryFindUniqueArgs>(args: SelectSubset<T, CustomerHistoryFindUniqueArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomerHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerHistoryFindUniqueOrThrowArgs} args - Arguments to find a CustomerHistory
     * @example
     * // Get one CustomerHistory
     * const customerHistory = await prisma.customerHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerHistoryFindFirstArgs} args - Arguments to find a CustomerHistory
     * @example
     * // Get one CustomerHistory
     * const customerHistory = await prisma.customerHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerHistoryFindFirstArgs>(args?: SelectSubset<T, CustomerHistoryFindFirstArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerHistoryFindFirstOrThrowArgs} args - Arguments to find a CustomerHistory
     * @example
     * // Get one CustomerHistory
     * const customerHistory = await prisma.customerHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomerHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerHistories
     * const customerHistories = await prisma.customerHistory.findMany()
     * 
     * // Get first 10 CustomerHistories
     * const customerHistories = await prisma.customerHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerHistoryWithIdOnly = await prisma.customerHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerHistoryFindManyArgs>(args?: SelectSubset<T, CustomerHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomerHistory.
     * @param {CustomerHistoryCreateArgs} args - Arguments to create a CustomerHistory.
     * @example
     * // Create one CustomerHistory
     * const CustomerHistory = await prisma.customerHistory.create({
     *   data: {
     *     // ... data to create a CustomerHistory
     *   }
     * })
     * 
     */
    create<T extends CustomerHistoryCreateArgs>(args: SelectSubset<T, CustomerHistoryCreateArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomerHistories.
     * @param {CustomerHistoryCreateManyArgs} args - Arguments to create many CustomerHistories.
     * @example
     * // Create many CustomerHistories
     * const customerHistory = await prisma.customerHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerHistoryCreateManyArgs>(args?: SelectSubset<T, CustomerHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CustomerHistory.
     * @param {CustomerHistoryDeleteArgs} args - Arguments to delete one CustomerHistory.
     * @example
     * // Delete one CustomerHistory
     * const CustomerHistory = await prisma.customerHistory.delete({
     *   where: {
     *     // ... filter to delete one CustomerHistory
     *   }
     * })
     * 
     */
    delete<T extends CustomerHistoryDeleteArgs>(args: SelectSubset<T, CustomerHistoryDeleteArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomerHistory.
     * @param {CustomerHistoryUpdateArgs} args - Arguments to update one CustomerHistory.
     * @example
     * // Update one CustomerHistory
     * const customerHistory = await prisma.customerHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerHistoryUpdateArgs>(args: SelectSubset<T, CustomerHistoryUpdateArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomerHistories.
     * @param {CustomerHistoryDeleteManyArgs} args - Arguments to filter CustomerHistories to delete.
     * @example
     * // Delete a few CustomerHistories
     * const { count } = await prisma.customerHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerHistoryDeleteManyArgs>(args?: SelectSubset<T, CustomerHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerHistories
     * const customerHistory = await prisma.customerHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerHistoryUpdateManyArgs>(args: SelectSubset<T, CustomerHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CustomerHistory.
     * @param {CustomerHistoryUpsertArgs} args - Arguments to update or create a CustomerHistory.
     * @example
     * // Update or create a CustomerHistory
     * const customerHistory = await prisma.customerHistory.upsert({
     *   create: {
     *     // ... data to create a CustomerHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerHistory we want to update
     *   }
     * })
     */
    upsert<T extends CustomerHistoryUpsertArgs>(args: SelectSubset<T, CustomerHistoryUpsertArgs<ExtArgs>>): Prisma__CustomerHistoryClient<$Result.GetResult<Prisma.$CustomerHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomerHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerHistoryCountArgs} args - Arguments to filter CustomerHistories to count.
     * @example
     * // Count the number of CustomerHistories
     * const count = await prisma.customerHistory.count({
     *   where: {
     *     // ... the filter for the CustomerHistories we want to count
     *   }
     * })
    **/
    count<T extends CustomerHistoryCountArgs>(
      args?: Subset<T, CustomerHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerHistoryAggregateArgs>(args: Subset<T, CustomerHistoryAggregateArgs>): Prisma.PrismaPromise<GetCustomerHistoryAggregateType<T>>

    /**
     * Group by CustomerHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerHistoryGroupByArgs['orderBy'] }
        : { orderBy?: CustomerHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerHistory model
   */
  readonly fields: CustomerHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CustomerHistory model
   */
  interface CustomerHistoryFieldRefs {
    readonly id: FieldRef<"CustomerHistory", 'String'>
    readonly eventType: FieldRef<"CustomerHistory", 'HistoryEventType'>
    readonly amount: FieldRef<"CustomerHistory", 'Float'>
    readonly ticketNumber: FieldRef<"CustomerHistory", 'String'>
    readonly date: FieldRef<"CustomerHistory", 'String'>
    readonly preparedBy: FieldRef<"CustomerHistory", 'String'>
    readonly reasonForPayment: FieldRef<"CustomerHistory", 'String'>
    readonly customerId: FieldRef<"CustomerHistory", 'String'>
    readonly createdAt: FieldRef<"CustomerHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerHistory findUnique
   */
  export type CustomerHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CustomerHistory to fetch.
     */
    where: CustomerHistoryWhereUniqueInput
  }

  /**
   * CustomerHistory findUniqueOrThrow
   */
  export type CustomerHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CustomerHistory to fetch.
     */
    where: CustomerHistoryWhereUniqueInput
  }

  /**
   * CustomerHistory findFirst
   */
  export type CustomerHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CustomerHistory to fetch.
     */
    where?: CustomerHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerHistories to fetch.
     */
    orderBy?: CustomerHistoryOrderByWithRelationInput | CustomerHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerHistories.
     */
    cursor?: CustomerHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerHistories.
     */
    distinct?: CustomerHistoryScalarFieldEnum | CustomerHistoryScalarFieldEnum[]
  }

  /**
   * CustomerHistory findFirstOrThrow
   */
  export type CustomerHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CustomerHistory to fetch.
     */
    where?: CustomerHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerHistories to fetch.
     */
    orderBy?: CustomerHistoryOrderByWithRelationInput | CustomerHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerHistories.
     */
    cursor?: CustomerHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerHistories.
     */
    distinct?: CustomerHistoryScalarFieldEnum | CustomerHistoryScalarFieldEnum[]
  }

  /**
   * CustomerHistory findMany
   */
  export type CustomerHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CustomerHistories to fetch.
     */
    where?: CustomerHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerHistories to fetch.
     */
    orderBy?: CustomerHistoryOrderByWithRelationInput | CustomerHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerHistories.
     */
    cursor?: CustomerHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerHistories.
     */
    skip?: number
    distinct?: CustomerHistoryScalarFieldEnum | CustomerHistoryScalarFieldEnum[]
  }

  /**
   * CustomerHistory create
   */
  export type CustomerHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomerHistory.
     */
    data: XOR<CustomerHistoryCreateInput, CustomerHistoryUncheckedCreateInput>
  }

  /**
   * CustomerHistory createMany
   */
  export type CustomerHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerHistories.
     */
    data: CustomerHistoryCreateManyInput | CustomerHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerHistory update
   */
  export type CustomerHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomerHistory.
     */
    data: XOR<CustomerHistoryUpdateInput, CustomerHistoryUncheckedUpdateInput>
    /**
     * Choose, which CustomerHistory to update.
     */
    where: CustomerHistoryWhereUniqueInput
  }

  /**
   * CustomerHistory updateMany
   */
  export type CustomerHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerHistories.
     */
    data: XOR<CustomerHistoryUpdateManyMutationInput, CustomerHistoryUncheckedUpdateManyInput>
    /**
     * Filter which CustomerHistories to update
     */
    where?: CustomerHistoryWhereInput
    /**
     * Limit how many CustomerHistories to update.
     */
    limit?: number
  }

  /**
   * CustomerHistory upsert
   */
  export type CustomerHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomerHistory to update in case it exists.
     */
    where: CustomerHistoryWhereUniqueInput
    /**
     * In case the CustomerHistory found by the `where` argument doesn't exist, create a new CustomerHistory with this data.
     */
    create: XOR<CustomerHistoryCreateInput, CustomerHistoryUncheckedCreateInput>
    /**
     * In case the CustomerHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerHistoryUpdateInput, CustomerHistoryUncheckedUpdateInput>
  }

  /**
   * CustomerHistory delete
   */
  export type CustomerHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
    /**
     * Filter which CustomerHistory to delete.
     */
    where: CustomerHistoryWhereUniqueInput
  }

  /**
   * CustomerHistory deleteMany
   */
  export type CustomerHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerHistories to delete
     */
    where?: CustomerHistoryWhereInput
    /**
     * Limit how many CustomerHistories to delete.
     */
    limit?: number
  }

  /**
   * CustomerHistory without action
   */
  export type CustomerHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerHistory
     */
    select?: CustomerHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerHistory
     */
    omit?: CustomerHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerHistoryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    branchId: 'branchId',
    ticketNumberStart: 'ticketNumberStart',
    ticketNumberEnd: 'ticketNumberEnd',
    currentTicketNumber: 'currentTicketNumber',
    isActive: 'isActive',
    failedLoginAttempts: 'failedLoginAttempts',
    isLocked: 'isLocked',
    lockedAt: 'lockedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    sex: 'sex',
    phoneNumber: 'phoneNumber',
    address: 'address',
    payersIdentification: 'payersIdentification',
    savingType: 'savingType',
    loanType: 'loanType',
    registrationDate: 'registrationDate',
    isActive: 'isActive',
    createdAt: 'createdAt',
    registeredBy: 'registeredBy'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const TicketScalarFieldEnum: {
    id: 'id',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    paymentAmount: 'paymentAmount',
    status: 'status',
    date: 'date',
    reasonForPayment: 'reasonForPayment',
    preparedBy: 'preparedBy',
    ticketNumber: 'ticketNumber',
    modeOfPayment: 'modeOfPayment',
    bankReceiptNo: 'bankReceiptNo',
    htmlContent: 'htmlContent',
    createdAt: 'createdAt',
    auditStatus: 'auditStatus',
    auditedBy: 'auditedBy',
    auditedAt: 'auditedAt',
    auditNote: 'auditNote'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const CustomerHistoryScalarFieldEnum: {
    id: 'id',
    eventType: 'eventType',
    amount: 'amount',
    ticketNumber: 'ticketNumber',
    date: 'date',
    preparedBy: 'preparedBy',
    reasonForPayment: 'reasonForPayment',
    customerId: 'customerId',
    createdAt: 'createdAt'
  };

  export type CustomerHistoryScalarFieldEnum = (typeof CustomerHistoryScalarFieldEnum)[keyof typeof CustomerHistoryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    branchId: 'branchId'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const CustomerOrderByRelevanceFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    phoneNumber: 'phoneNumber',
    address: 'address',
    payersIdentification: 'payersIdentification',
    savingType: 'savingType',
    loanType: 'loanType',
    registrationDate: 'registrationDate',
    registeredBy: 'registeredBy'
  };

  export type CustomerOrderByRelevanceFieldEnum = (typeof CustomerOrderByRelevanceFieldEnum)[keyof typeof CustomerOrderByRelevanceFieldEnum]


  export const TicketOrderByRelevanceFieldEnum: {
    id: 'id',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    date: 'date',
    reasonForPayment: 'reasonForPayment',
    preparedBy: 'preparedBy',
    ticketNumber: 'ticketNumber',
    bankReceiptNo: 'bankReceiptNo',
    htmlContent: 'htmlContent',
    auditedBy: 'auditedBy',
    auditNote: 'auditNote'
  };

  export type TicketOrderByRelevanceFieldEnum = (typeof TicketOrderByRelevanceFieldEnum)[keyof typeof TicketOrderByRelevanceFieldEnum]


  export const CustomerHistoryOrderByRelevanceFieldEnum: {
    id: 'id',
    ticketNumber: 'ticketNumber',
    date: 'date',
    preparedBy: 'preparedBy',
    reasonForPayment: 'reasonForPayment',
    customerId: 'customerId'
  };

  export type CustomerHistoryOrderByRelevanceFieldEnum = (typeof CustomerHistoryOrderByRelevanceFieldEnum)[keyof typeof CustomerHistoryOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Sex'
   */
  export type EnumSexFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sex'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'TicketStatus'
   */
  export type EnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TicketStatus'>
    


  /**
   * Reference to a field of type 'PaymentMode'
   */
  export type EnumPaymentModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMode'>
    


  /**
   * Reference to a field of type 'AuditStatus'
   */
  export type EnumAuditStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditStatus'>
    


  /**
   * Reference to a field of type 'HistoryEventType'
   */
  export type EnumHistoryEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HistoryEventType'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    branchId?: StringFilter<"User"> | string
    ticketNumberStart?: IntNullableFilter<"User"> | number | null
    ticketNumberEnd?: IntNullableFilter<"User"> | number | null
    currentTicketNumber?: IntNullableFilter<"User"> | number | null
    isActive?: BoolFilter<"User"> | boolean
    failedLoginAttempts?: IntFilter<"User"> | number
    isLocked?: BoolFilter<"User"> | boolean
    lockedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tickets?: TicketListRelationFilter
    customers?: CustomerListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    branchId?: SortOrder
    ticketNumberStart?: SortOrderInput | SortOrder
    ticketNumberEnd?: SortOrderInput | SortOrder
    currentTicketNumber?: SortOrderInput | SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tickets?: TicketOrderByRelationAggregateInput
    customers?: CustomerOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    branchId?: StringFilter<"User"> | string
    ticketNumberStart?: IntNullableFilter<"User"> | number | null
    ticketNumberEnd?: IntNullableFilter<"User"> | number | null
    currentTicketNumber?: IntNullableFilter<"User"> | number | null
    isActive?: BoolFilter<"User"> | boolean
    failedLoginAttempts?: IntFilter<"User"> | number
    isLocked?: BoolFilter<"User"> | boolean
    lockedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tickets?: TicketListRelationFilter
    customers?: CustomerListRelationFilter
  }, "id" | "name" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    branchId?: SortOrder
    ticketNumberStart?: SortOrderInput | SortOrder
    ticketNumberEnd?: SortOrderInput | SortOrder
    currentTicketNumber?: SortOrderInput | SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    branchId?: StringWithAggregatesFilter<"User"> | string
    ticketNumberStart?: IntNullableWithAggregatesFilter<"User"> | number | null
    ticketNumberEnd?: IntNullableWithAggregatesFilter<"User"> | number | null
    currentTicketNumber?: IntNullableWithAggregatesFilter<"User"> | number | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    failedLoginAttempts?: IntWithAggregatesFilter<"User"> | number
    isLocked?: BoolWithAggregatesFilter<"User"> | boolean
    lockedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    fullName?: StringFilter<"Customer"> | string
    sex?: EnumSexFilter<"Customer"> | $Enums.Sex
    phoneNumber?: StringFilter<"Customer"> | string
    address?: StringNullableFilter<"Customer"> | string | null
    payersIdentification?: StringFilter<"Customer"> | string
    savingType?: StringFilter<"Customer"> | string
    loanType?: StringFilter<"Customer"> | string
    registrationDate?: StringFilter<"Customer"> | string
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    registeredBy?: StringFilter<"Customer"> | string
    registeredByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    tickets?: TicketListRelationFilter
    history?: CustomerHistoryListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrderInput | SortOrder
    payersIdentification?: SortOrder
    savingType?: SortOrder
    loanType?: SortOrder
    registrationDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    registeredBy?: SortOrder
    registeredByUser?: UserOrderByWithRelationInput
    tickets?: TicketOrderByRelationAggregateInput
    history?: CustomerHistoryOrderByRelationAggregateInput
    _relevance?: CustomerOrderByRelevanceInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phoneNumber?: string
    payersIdentification?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    fullName?: StringFilter<"Customer"> | string
    sex?: EnumSexFilter<"Customer"> | $Enums.Sex
    address?: StringNullableFilter<"Customer"> | string | null
    savingType?: StringFilter<"Customer"> | string
    loanType?: StringFilter<"Customer"> | string
    registrationDate?: StringFilter<"Customer"> | string
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    registeredBy?: StringFilter<"Customer"> | string
    registeredByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    tickets?: TicketListRelationFilter
    history?: CustomerHistoryListRelationFilter
  }, "id" | "phoneNumber" | "payersIdentification">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrderInput | SortOrder
    payersIdentification?: SortOrder
    savingType?: SortOrder
    loanType?: SortOrder
    registrationDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    registeredBy?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    fullName?: StringWithAggregatesFilter<"Customer"> | string
    sex?: EnumSexWithAggregatesFilter<"Customer"> | $Enums.Sex
    phoneNumber?: StringWithAggregatesFilter<"Customer"> | string
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    payersIdentification?: StringWithAggregatesFilter<"Customer"> | string
    savingType?: StringWithAggregatesFilter<"Customer"> | string
    loanType?: StringWithAggregatesFilter<"Customer"> | string
    registrationDate?: StringWithAggregatesFilter<"Customer"> | string
    isActive?: BoolWithAggregatesFilter<"Customer"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    registeredBy?: StringWithAggregatesFilter<"Customer"> | string
  }

  export type TicketWhereInput = {
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    id?: StringFilter<"Ticket"> | string
    customerName?: StringFilter<"Ticket"> | string
    customerPhone?: StringNullableFilter<"Ticket"> | string | null
    paymentAmount?: FloatFilter<"Ticket"> | number
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    date?: StringFilter<"Ticket"> | string
    reasonForPayment?: StringNullableFilter<"Ticket"> | string | null
    preparedBy?: StringFilter<"Ticket"> | string
    ticketNumber?: StringFilter<"Ticket"> | string
    modeOfPayment?: EnumPaymentModeNullableFilter<"Ticket"> | $Enums.PaymentMode | null
    bankReceiptNo?: StringNullableFilter<"Ticket"> | string | null
    htmlContent?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    auditStatus?: EnumAuditStatusFilter<"Ticket"> | $Enums.AuditStatus
    auditedBy?: StringNullableFilter<"Ticket"> | string | null
    auditedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    auditNote?: StringNullableFilter<"Ticket"> | string | null
    preparedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    customer?: XOR<CustomerNullableScalarRelationFilter, CustomerWhereInput> | null
  }

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrderInput | SortOrder
    paymentAmount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    reasonForPayment?: SortOrderInput | SortOrder
    preparedBy?: SortOrder
    ticketNumber?: SortOrder
    modeOfPayment?: SortOrderInput | SortOrder
    bankReceiptNo?: SortOrderInput | SortOrder
    htmlContent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    auditStatus?: SortOrder
    auditedBy?: SortOrderInput | SortOrder
    auditedAt?: SortOrderInput | SortOrder
    auditNote?: SortOrderInput | SortOrder
    preparedByUser?: UserOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    _relevance?: TicketOrderByRelevanceInput
  }

  export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    customerName?: StringFilter<"Ticket"> | string
    customerPhone?: StringNullableFilter<"Ticket"> | string | null
    paymentAmount?: FloatFilter<"Ticket"> | number
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    date?: StringFilter<"Ticket"> | string
    reasonForPayment?: StringNullableFilter<"Ticket"> | string | null
    preparedBy?: StringFilter<"Ticket"> | string
    ticketNumber?: StringFilter<"Ticket"> | string
    modeOfPayment?: EnumPaymentModeNullableFilter<"Ticket"> | $Enums.PaymentMode | null
    bankReceiptNo?: StringNullableFilter<"Ticket"> | string | null
    htmlContent?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    auditStatus?: EnumAuditStatusFilter<"Ticket"> | $Enums.AuditStatus
    auditedBy?: StringNullableFilter<"Ticket"> | string | null
    auditedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    auditNote?: StringNullableFilter<"Ticket"> | string | null
    preparedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    customer?: XOR<CustomerNullableScalarRelationFilter, CustomerWhereInput> | null
  }, "id">

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrderInput | SortOrder
    paymentAmount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    reasonForPayment?: SortOrderInput | SortOrder
    preparedBy?: SortOrder
    ticketNumber?: SortOrder
    modeOfPayment?: SortOrderInput | SortOrder
    bankReceiptNo?: SortOrderInput | SortOrder
    htmlContent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    auditStatus?: SortOrder
    auditedBy?: SortOrderInput | SortOrder
    auditedAt?: SortOrderInput | SortOrder
    auditNote?: SortOrderInput | SortOrder
    _count?: TicketCountOrderByAggregateInput
    _avg?: TicketAvgOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
    _sum?: TicketSumOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    OR?: TicketScalarWhereWithAggregatesInput[]
    NOT?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ticket"> | string
    customerName?: StringWithAggregatesFilter<"Ticket"> | string
    customerPhone?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    paymentAmount?: FloatWithAggregatesFilter<"Ticket"> | number
    status?: EnumTicketStatusWithAggregatesFilter<"Ticket"> | $Enums.TicketStatus
    date?: StringWithAggregatesFilter<"Ticket"> | string
    reasonForPayment?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    preparedBy?: StringWithAggregatesFilter<"Ticket"> | string
    ticketNumber?: StringWithAggregatesFilter<"Ticket"> | string
    modeOfPayment?: EnumPaymentModeNullableWithAggregatesFilter<"Ticket"> | $Enums.PaymentMode | null
    bankReceiptNo?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    htmlContent?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    auditStatus?: EnumAuditStatusWithAggregatesFilter<"Ticket"> | $Enums.AuditStatus
    auditedBy?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    auditedAt?: DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null
    auditNote?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
  }

  export type CustomerHistoryWhereInput = {
    AND?: CustomerHistoryWhereInput | CustomerHistoryWhereInput[]
    OR?: CustomerHistoryWhereInput[]
    NOT?: CustomerHistoryWhereInput | CustomerHistoryWhereInput[]
    id?: StringFilter<"CustomerHistory"> | string
    eventType?: EnumHistoryEventTypeFilter<"CustomerHistory"> | $Enums.HistoryEventType
    amount?: FloatFilter<"CustomerHistory"> | number
    ticketNumber?: StringFilter<"CustomerHistory"> | string
    date?: StringFilter<"CustomerHistory"> | string
    preparedBy?: StringFilter<"CustomerHistory"> | string
    reasonForPayment?: StringNullableFilter<"CustomerHistory"> | string | null
    customerId?: StringFilter<"CustomerHistory"> | string
    createdAt?: DateTimeFilter<"CustomerHistory"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
  }

  export type CustomerHistoryOrderByWithRelationInput = {
    id?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    ticketNumber?: SortOrder
    date?: SortOrder
    preparedBy?: SortOrder
    reasonForPayment?: SortOrderInput | SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    _relevance?: CustomerHistoryOrderByRelevanceInput
  }

  export type CustomerHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CustomerHistoryWhereInput | CustomerHistoryWhereInput[]
    OR?: CustomerHistoryWhereInput[]
    NOT?: CustomerHistoryWhereInput | CustomerHistoryWhereInput[]
    eventType?: EnumHistoryEventTypeFilter<"CustomerHistory"> | $Enums.HistoryEventType
    amount?: FloatFilter<"CustomerHistory"> | number
    ticketNumber?: StringFilter<"CustomerHistory"> | string
    date?: StringFilter<"CustomerHistory"> | string
    preparedBy?: StringFilter<"CustomerHistory"> | string
    reasonForPayment?: StringNullableFilter<"CustomerHistory"> | string | null
    customerId?: StringFilter<"CustomerHistory"> | string
    createdAt?: DateTimeFilter<"CustomerHistory"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
  }, "id">

  export type CustomerHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    ticketNumber?: SortOrder
    date?: SortOrder
    preparedBy?: SortOrder
    reasonForPayment?: SortOrderInput | SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
    _count?: CustomerHistoryCountOrderByAggregateInput
    _avg?: CustomerHistoryAvgOrderByAggregateInput
    _max?: CustomerHistoryMaxOrderByAggregateInput
    _min?: CustomerHistoryMinOrderByAggregateInput
    _sum?: CustomerHistorySumOrderByAggregateInput
  }

  export type CustomerHistoryScalarWhereWithAggregatesInput = {
    AND?: CustomerHistoryScalarWhereWithAggregatesInput | CustomerHistoryScalarWhereWithAggregatesInput[]
    OR?: CustomerHistoryScalarWhereWithAggregatesInput[]
    NOT?: CustomerHistoryScalarWhereWithAggregatesInput | CustomerHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomerHistory"> | string
    eventType?: EnumHistoryEventTypeWithAggregatesFilter<"CustomerHistory"> | $Enums.HistoryEventType
    amount?: FloatWithAggregatesFilter<"CustomerHistory"> | number
    ticketNumber?: StringWithAggregatesFilter<"CustomerHistory"> | string
    date?: StringWithAggregatesFilter<"CustomerHistory"> | string
    preparedBy?: StringWithAggregatesFilter<"CustomerHistory"> | string
    reasonForPayment?: StringNullableWithAggregatesFilter<"CustomerHistory"> | string | null
    customerId?: StringWithAggregatesFilter<"CustomerHistory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CustomerHistory"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart?: number | null
    ticketNumberEnd?: number | null
    currentTicketNumber?: number | null
    isActive?: boolean
    failedLoginAttempts?: number
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketCreateNestedManyWithoutPreparedByUserInput
    customers?: CustomerCreateNestedManyWithoutRegisteredByUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart?: number | null
    ticketNumberEnd?: number | null
    currentTicketNumber?: number | null
    isActive?: boolean
    failedLoginAttempts?: number
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketUncheckedCreateNestedManyWithoutPreparedByUserInput
    customers?: CustomerUncheckedCreateNestedManyWithoutRegisteredByUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUpdateManyWithoutPreparedByUserNestedInput
    customers?: CustomerUpdateManyWithoutRegisteredByUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUncheckedUpdateManyWithoutPreparedByUserNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutRegisteredByUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart?: number | null
    ticketNumberEnd?: number | null
    currentTicketNumber?: number | null
    isActive?: boolean
    failedLoginAttempts?: number
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerCreateInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    registeredByUser?: UserCreateNestedOneWithoutCustomersInput
    tickets?: TicketCreateNestedManyWithoutCustomerInput
    history?: CustomerHistoryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    registeredBy: string
    tickets?: TicketUncheckedCreateNestedManyWithoutCustomerInput
    history?: CustomerHistoryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registeredByUser?: UserUpdateOneWithoutCustomersNestedInput
    tickets?: TicketUpdateManyWithoutCustomerNestedInput
    history?: CustomerHistoryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registeredBy?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUncheckedUpdateManyWithoutCustomerNestedInput
    history?: CustomerHistoryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    registeredBy: string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registeredBy?: StringFieldUpdateOperationsInput | string
  }

  export type TicketCreateInput = {
    id?: string
    customerName: string
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
    preparedByUser?: UserCreateNestedOneWithoutTicketsInput
    customer?: CustomerCreateNestedOneWithoutTicketsInput
  }

  export type TicketUncheckedCreateInput = {
    id?: string
    customerName: string
    customerPhone?: string | null
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    preparedBy: string
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
  }

  export type TicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
    preparedByUser?: UserUpdateOneWithoutTicketsNestedInput
    customer?: CustomerUpdateOneWithoutTicketsNestedInput
  }

  export type TicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    preparedBy?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketCreateManyInput = {
    id?: string
    customerName: string
    customerPhone?: string | null
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    preparedBy: string
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
  }

  export type TicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    preparedBy?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerHistoryCreateInput = {
    id?: string
    eventType: $Enums.HistoryEventType
    amount: number
    ticketNumber: string
    date: string
    preparedBy: string
    reasonForPayment?: string | null
    createdAt?: Date | string
    customer: CustomerCreateNestedOneWithoutHistoryInput
  }

  export type CustomerHistoryUncheckedCreateInput = {
    id?: string
    eventType: $Enums.HistoryEventType
    amount: number
    ticketNumber: string
    date: string
    preparedBy: string
    reasonForPayment?: string | null
    customerId: string
    createdAt?: Date | string
  }

  export type CustomerHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumHistoryEventTypeFieldUpdateOperationsInput | $Enums.HistoryEventType
    amount?: FloatFieldUpdateOperationsInput | number
    ticketNumber?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    preparedBy?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutHistoryNestedInput
  }

  export type CustomerHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumHistoryEventTypeFieldUpdateOperationsInput | $Enums.HistoryEventType
    amount?: FloatFieldUpdateOperationsInput | number
    ticketNumber?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    preparedBy?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerHistoryCreateManyInput = {
    id?: string
    eventType: $Enums.HistoryEventType
    amount: number
    ticketNumber: string
    date: string
    preparedBy: string
    reasonForPayment?: string | null
    customerId: string
    createdAt?: Date | string
  }

  export type CustomerHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumHistoryEventTypeFieldUpdateOperationsInput | $Enums.HistoryEventType
    amount?: FloatFieldUpdateOperationsInput | number
    ticketNumber?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    preparedBy?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumHistoryEventTypeFieldUpdateOperationsInput | $Enums.HistoryEventType
    amount?: FloatFieldUpdateOperationsInput | number
    ticketNumber?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    preparedBy?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TicketListRelationFilter = {
    every?: TicketWhereInput
    some?: TicketWhereInput
    none?: TicketWhereInput
  }

  export type CustomerListRelationFilter = {
    every?: CustomerWhereInput
    some?: CustomerWhereInput
    none?: CustomerWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    ticketNumberStart?: SortOrder
    ticketNumberEnd?: SortOrder
    currentTicketNumber?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    ticketNumberStart?: SortOrder
    ticketNumberEnd?: SortOrder
    currentTicketNumber?: SortOrder
    failedLoginAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    ticketNumberStart?: SortOrder
    ticketNumberEnd?: SortOrder
    currentTicketNumber?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    branchId?: SortOrder
    ticketNumberStart?: SortOrder
    ticketNumberEnd?: SortOrder
    currentTicketNumber?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    ticketNumberStart?: SortOrder
    ticketNumberEnd?: SortOrder
    currentTicketNumber?: SortOrder
    failedLoginAttempts?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumSexFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[]
    notIn?: $Enums.Sex[]
    not?: NestedEnumSexFilter<$PrismaModel> | $Enums.Sex
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type CustomerHistoryListRelationFilter = {
    every?: CustomerHistoryWhereInput
    some?: CustomerHistoryWhereInput
    none?: CustomerHistoryWhereInput
  }

  export type CustomerHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderByRelevanceInput = {
    fields: CustomerOrderByRelevanceFieldEnum | CustomerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    payersIdentification?: SortOrder
    savingType?: SortOrder
    loanType?: SortOrder
    registrationDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    registeredBy?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    payersIdentification?: SortOrder
    savingType?: SortOrder
    loanType?: SortOrder
    registrationDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    registeredBy?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    phoneNumber?: SortOrder
    address?: SortOrder
    payersIdentification?: SortOrder
    savingType?: SortOrder
    loanType?: SortOrder
    registrationDate?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    registeredBy?: SortOrder
  }

  export type EnumSexWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[]
    notIn?: $Enums.Sex[]
    not?: NestedEnumSexWithAggregatesFilter<$PrismaModel> | $Enums.Sex
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSexFilter<$PrismaModel>
    _max?: NestedEnumSexFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type EnumPaymentModeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMode | EnumPaymentModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMode[] | null
    notIn?: $Enums.PaymentMode[] | null
    not?: NestedEnumPaymentModeNullableFilter<$PrismaModel> | $Enums.PaymentMode | null
  }

  export type EnumAuditStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditStatus | EnumAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuditStatus[]
    notIn?: $Enums.AuditStatus[]
    not?: NestedEnumAuditStatusFilter<$PrismaModel> | $Enums.AuditStatus
  }

  export type CustomerNullableScalarRelationFilter = {
    is?: CustomerWhereInput | null
    isNot?: CustomerWhereInput | null
  }

  export type TicketOrderByRelevanceInput = {
    fields: TicketOrderByRelevanceFieldEnum | TicketOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    paymentAmount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    reasonForPayment?: SortOrder
    preparedBy?: SortOrder
    ticketNumber?: SortOrder
    modeOfPayment?: SortOrder
    bankReceiptNo?: SortOrder
    htmlContent?: SortOrder
    createdAt?: SortOrder
    auditStatus?: SortOrder
    auditedBy?: SortOrder
    auditedAt?: SortOrder
    auditNote?: SortOrder
  }

  export type TicketAvgOrderByAggregateInput = {
    paymentAmount?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    paymentAmount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    reasonForPayment?: SortOrder
    preparedBy?: SortOrder
    ticketNumber?: SortOrder
    modeOfPayment?: SortOrder
    bankReceiptNo?: SortOrder
    htmlContent?: SortOrder
    createdAt?: SortOrder
    auditStatus?: SortOrder
    auditedBy?: SortOrder
    auditedAt?: SortOrder
    auditNote?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    paymentAmount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    reasonForPayment?: SortOrder
    preparedBy?: SortOrder
    ticketNumber?: SortOrder
    modeOfPayment?: SortOrder
    bankReceiptNo?: SortOrder
    htmlContent?: SortOrder
    createdAt?: SortOrder
    auditStatus?: SortOrder
    auditedBy?: SortOrder
    auditedAt?: SortOrder
    auditNote?: SortOrder
  }

  export type TicketSumOrderByAggregateInput = {
    paymentAmount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type EnumPaymentModeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMode | EnumPaymentModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMode[] | null
    notIn?: $Enums.PaymentMode[] | null
    not?: NestedEnumPaymentModeNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMode | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentModeNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentModeNullableFilter<$PrismaModel>
  }

  export type EnumAuditStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditStatus | EnumAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuditStatus[]
    notIn?: $Enums.AuditStatus[]
    not?: NestedEnumAuditStatusWithAggregatesFilter<$PrismaModel> | $Enums.AuditStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditStatusFilter<$PrismaModel>
    _max?: NestedEnumAuditStatusFilter<$PrismaModel>
  }

  export type EnumHistoryEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.HistoryEventType | EnumHistoryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HistoryEventType[]
    notIn?: $Enums.HistoryEventType[]
    not?: NestedEnumHistoryEventTypeFilter<$PrismaModel> | $Enums.HistoryEventType
  }

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type CustomerHistoryOrderByRelevanceInput = {
    fields: CustomerHistoryOrderByRelevanceFieldEnum | CustomerHistoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CustomerHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    ticketNumber?: SortOrder
    date?: SortOrder
    preparedBy?: SortOrder
    reasonForPayment?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerHistoryAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type CustomerHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    ticketNumber?: SortOrder
    date?: SortOrder
    preparedBy?: SortOrder
    reasonForPayment?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    ticketNumber?: SortOrder
    date?: SortOrder
    preparedBy?: SortOrder
    reasonForPayment?: SortOrder
    customerId?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerHistorySumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumHistoryEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HistoryEventType | EnumHistoryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HistoryEventType[]
    notIn?: $Enums.HistoryEventType[]
    not?: NestedEnumHistoryEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.HistoryEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHistoryEventTypeFilter<$PrismaModel>
    _max?: NestedEnumHistoryEventTypeFilter<$PrismaModel>
  }

  export type TicketCreateNestedManyWithoutPreparedByUserInput = {
    create?: XOR<TicketCreateWithoutPreparedByUserInput, TicketUncheckedCreateWithoutPreparedByUserInput> | TicketCreateWithoutPreparedByUserInput[] | TicketUncheckedCreateWithoutPreparedByUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutPreparedByUserInput | TicketCreateOrConnectWithoutPreparedByUserInput[]
    createMany?: TicketCreateManyPreparedByUserInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type CustomerCreateNestedManyWithoutRegisteredByUserInput = {
    create?: XOR<CustomerCreateWithoutRegisteredByUserInput, CustomerUncheckedCreateWithoutRegisteredByUserInput> | CustomerCreateWithoutRegisteredByUserInput[] | CustomerUncheckedCreateWithoutRegisteredByUserInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutRegisteredByUserInput | CustomerCreateOrConnectWithoutRegisteredByUserInput[]
    createMany?: CustomerCreateManyRegisteredByUserInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutPreparedByUserInput = {
    create?: XOR<TicketCreateWithoutPreparedByUserInput, TicketUncheckedCreateWithoutPreparedByUserInput> | TicketCreateWithoutPreparedByUserInput[] | TicketUncheckedCreateWithoutPreparedByUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutPreparedByUserInput | TicketCreateOrConnectWithoutPreparedByUserInput[]
    createMany?: TicketCreateManyPreparedByUserInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type CustomerUncheckedCreateNestedManyWithoutRegisteredByUserInput = {
    create?: XOR<CustomerCreateWithoutRegisteredByUserInput, CustomerUncheckedCreateWithoutRegisteredByUserInput> | CustomerCreateWithoutRegisteredByUserInput[] | CustomerUncheckedCreateWithoutRegisteredByUserInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutRegisteredByUserInput | CustomerCreateOrConnectWithoutRegisteredByUserInput[]
    createMany?: CustomerCreateManyRegisteredByUserInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TicketUpdateManyWithoutPreparedByUserNestedInput = {
    create?: XOR<TicketCreateWithoutPreparedByUserInput, TicketUncheckedCreateWithoutPreparedByUserInput> | TicketCreateWithoutPreparedByUserInput[] | TicketUncheckedCreateWithoutPreparedByUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutPreparedByUserInput | TicketCreateOrConnectWithoutPreparedByUserInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutPreparedByUserInput | TicketUpsertWithWhereUniqueWithoutPreparedByUserInput[]
    createMany?: TicketCreateManyPreparedByUserInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutPreparedByUserInput | TicketUpdateWithWhereUniqueWithoutPreparedByUserInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutPreparedByUserInput | TicketUpdateManyWithWhereWithoutPreparedByUserInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type CustomerUpdateManyWithoutRegisteredByUserNestedInput = {
    create?: XOR<CustomerCreateWithoutRegisteredByUserInput, CustomerUncheckedCreateWithoutRegisteredByUserInput> | CustomerCreateWithoutRegisteredByUserInput[] | CustomerUncheckedCreateWithoutRegisteredByUserInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutRegisteredByUserInput | CustomerCreateOrConnectWithoutRegisteredByUserInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutRegisteredByUserInput | CustomerUpsertWithWhereUniqueWithoutRegisteredByUserInput[]
    createMany?: CustomerCreateManyRegisteredByUserInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutRegisteredByUserInput | CustomerUpdateWithWhereUniqueWithoutRegisteredByUserInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutRegisteredByUserInput | CustomerUpdateManyWithWhereWithoutRegisteredByUserInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutPreparedByUserNestedInput = {
    create?: XOR<TicketCreateWithoutPreparedByUserInput, TicketUncheckedCreateWithoutPreparedByUserInput> | TicketCreateWithoutPreparedByUserInput[] | TicketUncheckedCreateWithoutPreparedByUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutPreparedByUserInput | TicketCreateOrConnectWithoutPreparedByUserInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutPreparedByUserInput | TicketUpsertWithWhereUniqueWithoutPreparedByUserInput[]
    createMany?: TicketCreateManyPreparedByUserInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutPreparedByUserInput | TicketUpdateWithWhereUniqueWithoutPreparedByUserInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutPreparedByUserInput | TicketUpdateManyWithWhereWithoutPreparedByUserInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type CustomerUncheckedUpdateManyWithoutRegisteredByUserNestedInput = {
    create?: XOR<CustomerCreateWithoutRegisteredByUserInput, CustomerUncheckedCreateWithoutRegisteredByUserInput> | CustomerCreateWithoutRegisteredByUserInput[] | CustomerUncheckedCreateWithoutRegisteredByUserInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutRegisteredByUserInput | CustomerCreateOrConnectWithoutRegisteredByUserInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutRegisteredByUserInput | CustomerUpsertWithWhereUniqueWithoutRegisteredByUserInput[]
    createMany?: CustomerCreateManyRegisteredByUserInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutRegisteredByUserInput | CustomerUpdateWithWhereUniqueWithoutRegisteredByUserInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutRegisteredByUserInput | CustomerUpdateManyWithWhereWithoutRegisteredByUserInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCustomersInput = {
    create?: XOR<UserCreateWithoutCustomersInput, UserUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomersInput
    connect?: UserWhereUniqueInput
  }

  export type TicketCreateNestedManyWithoutCustomerInput = {
    create?: XOR<TicketCreateWithoutCustomerInput, TicketUncheckedCreateWithoutCustomerInput> | TicketCreateWithoutCustomerInput[] | TicketUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutCustomerInput | TicketCreateOrConnectWithoutCustomerInput[]
    createMany?: TicketCreateManyCustomerInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type CustomerHistoryCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerHistoryCreateWithoutCustomerInput, CustomerHistoryUncheckedCreateWithoutCustomerInput> | CustomerHistoryCreateWithoutCustomerInput[] | CustomerHistoryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerHistoryCreateOrConnectWithoutCustomerInput | CustomerHistoryCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerHistoryCreateManyCustomerInputEnvelope
    connect?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<TicketCreateWithoutCustomerInput, TicketUncheckedCreateWithoutCustomerInput> | TicketCreateWithoutCustomerInput[] | TicketUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutCustomerInput | TicketCreateOrConnectWithoutCustomerInput[]
    createMany?: TicketCreateManyCustomerInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type CustomerHistoryUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerHistoryCreateWithoutCustomerInput, CustomerHistoryUncheckedCreateWithoutCustomerInput> | CustomerHistoryCreateWithoutCustomerInput[] | CustomerHistoryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerHistoryCreateOrConnectWithoutCustomerInput | CustomerHistoryCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerHistoryCreateManyCustomerInputEnvelope
    connect?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
  }

  export type EnumSexFieldUpdateOperationsInput = {
    set?: $Enums.Sex
  }

  export type UserUpdateOneWithoutCustomersNestedInput = {
    create?: XOR<UserCreateWithoutCustomersInput, UserUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomersInput
    upsert?: UserUpsertWithoutCustomersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCustomersInput, UserUpdateWithoutCustomersInput>, UserUncheckedUpdateWithoutCustomersInput>
  }

  export type TicketUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<TicketCreateWithoutCustomerInput, TicketUncheckedCreateWithoutCustomerInput> | TicketCreateWithoutCustomerInput[] | TicketUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutCustomerInput | TicketCreateOrConnectWithoutCustomerInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutCustomerInput | TicketUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: TicketCreateManyCustomerInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutCustomerInput | TicketUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutCustomerInput | TicketUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type CustomerHistoryUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerHistoryCreateWithoutCustomerInput, CustomerHistoryUncheckedCreateWithoutCustomerInput> | CustomerHistoryCreateWithoutCustomerInput[] | CustomerHistoryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerHistoryCreateOrConnectWithoutCustomerInput | CustomerHistoryCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerHistoryUpsertWithWhereUniqueWithoutCustomerInput | CustomerHistoryUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerHistoryCreateManyCustomerInputEnvelope
    set?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    disconnect?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    delete?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    connect?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    update?: CustomerHistoryUpdateWithWhereUniqueWithoutCustomerInput | CustomerHistoryUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerHistoryUpdateManyWithWhereWithoutCustomerInput | CustomerHistoryUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerHistoryScalarWhereInput | CustomerHistoryScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<TicketCreateWithoutCustomerInput, TicketUncheckedCreateWithoutCustomerInput> | TicketCreateWithoutCustomerInput[] | TicketUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutCustomerInput | TicketCreateOrConnectWithoutCustomerInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutCustomerInput | TicketUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: TicketCreateManyCustomerInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutCustomerInput | TicketUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutCustomerInput | TicketUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type CustomerHistoryUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerHistoryCreateWithoutCustomerInput, CustomerHistoryUncheckedCreateWithoutCustomerInput> | CustomerHistoryCreateWithoutCustomerInput[] | CustomerHistoryUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerHistoryCreateOrConnectWithoutCustomerInput | CustomerHistoryCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerHistoryUpsertWithWhereUniqueWithoutCustomerInput | CustomerHistoryUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerHistoryCreateManyCustomerInputEnvelope
    set?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    disconnect?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    delete?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    connect?: CustomerHistoryWhereUniqueInput | CustomerHistoryWhereUniqueInput[]
    update?: CustomerHistoryUpdateWithWhereUniqueWithoutCustomerInput | CustomerHistoryUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerHistoryUpdateManyWithWhereWithoutCustomerInput | CustomerHistoryUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerHistoryScalarWhereInput | CustomerHistoryScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTicketsInput = {
    create?: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTicketsInput
    connect?: UserWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutTicketsInput = {
    create?: XOR<CustomerCreateWithoutTicketsInput, CustomerUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutTicketsInput
    connect?: CustomerWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumTicketStatusFieldUpdateOperationsInput = {
    set?: $Enums.TicketStatus
  }

  export type NullableEnumPaymentModeFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMode | null
  }

  export type EnumAuditStatusFieldUpdateOperationsInput = {
    set?: $Enums.AuditStatus
  }

  export type UserUpdateOneWithoutTicketsNestedInput = {
    create?: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTicketsInput
    upsert?: UserUpsertWithoutTicketsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTicketsInput, UserUpdateWithoutTicketsInput>, UserUncheckedUpdateWithoutTicketsInput>
  }

  export type CustomerUpdateOneWithoutTicketsNestedInput = {
    create?: XOR<CustomerCreateWithoutTicketsInput, CustomerUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutTicketsInput
    upsert?: CustomerUpsertWithoutTicketsInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutTicketsInput, CustomerUpdateWithoutTicketsInput>, CustomerUncheckedUpdateWithoutTicketsInput>
  }

  export type CustomerCreateNestedOneWithoutHistoryInput = {
    create?: XOR<CustomerCreateWithoutHistoryInput, CustomerUncheckedCreateWithoutHistoryInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutHistoryInput
    connect?: CustomerWhereUniqueInput
  }

  export type EnumHistoryEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.HistoryEventType
  }

  export type CustomerUpdateOneRequiredWithoutHistoryNestedInput = {
    create?: XOR<CustomerCreateWithoutHistoryInput, CustomerUncheckedCreateWithoutHistoryInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutHistoryInput
    upsert?: CustomerUpsertWithoutHistoryInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutHistoryInput, CustomerUpdateWithoutHistoryInput>, CustomerUncheckedUpdateWithoutHistoryInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumSexFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[]
    notIn?: $Enums.Sex[]
    not?: NestedEnumSexFilter<$PrismaModel> | $Enums.Sex
  }

  export type NestedEnumSexWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[]
    notIn?: $Enums.Sex[]
    not?: NestedEnumSexWithAggregatesFilter<$PrismaModel> | $Enums.Sex
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSexFilter<$PrismaModel>
    _max?: NestedEnumSexFilter<$PrismaModel>
  }

  export type NestedEnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus
  }

  export type NestedEnumPaymentModeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMode | EnumPaymentModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMode[] | null
    notIn?: $Enums.PaymentMode[] | null
    not?: NestedEnumPaymentModeNullableFilter<$PrismaModel> | $Enums.PaymentMode | null
  }

  export type NestedEnumAuditStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditStatus | EnumAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuditStatus[]
    notIn?: $Enums.AuditStatus[]
    not?: NestedEnumAuditStatusFilter<$PrismaModel> | $Enums.AuditStatus
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TicketStatus[]
    notIn?: $Enums.TicketStatus[]
    not?: NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel> | $Enums.TicketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentModeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMode | EnumPaymentModeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PaymentMode[] | null
    notIn?: $Enums.PaymentMode[] | null
    not?: NestedEnumPaymentModeNullableWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMode | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPaymentModeNullableFilter<$PrismaModel>
    _max?: NestedEnumPaymentModeNullableFilter<$PrismaModel>
  }

  export type NestedEnumAuditStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditStatus | EnumAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuditStatus[]
    notIn?: $Enums.AuditStatus[]
    not?: NestedEnumAuditStatusWithAggregatesFilter<$PrismaModel> | $Enums.AuditStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditStatusFilter<$PrismaModel>
    _max?: NestedEnumAuditStatusFilter<$PrismaModel>
  }

  export type NestedEnumHistoryEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.HistoryEventType | EnumHistoryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HistoryEventType[]
    notIn?: $Enums.HistoryEventType[]
    not?: NestedEnumHistoryEventTypeFilter<$PrismaModel> | $Enums.HistoryEventType
  }

  export type NestedEnumHistoryEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HistoryEventType | EnumHistoryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.HistoryEventType[]
    notIn?: $Enums.HistoryEventType[]
    not?: NestedEnumHistoryEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.HistoryEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHistoryEventTypeFilter<$PrismaModel>
    _max?: NestedEnumHistoryEventTypeFilter<$PrismaModel>
  }

  export type TicketCreateWithoutPreparedByUserInput = {
    id?: string
    customerName: string
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
    customer?: CustomerCreateNestedOneWithoutTicketsInput
  }

  export type TicketUncheckedCreateWithoutPreparedByUserInput = {
    id?: string
    customerName: string
    customerPhone?: string | null
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
  }

  export type TicketCreateOrConnectWithoutPreparedByUserInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutPreparedByUserInput, TicketUncheckedCreateWithoutPreparedByUserInput>
  }

  export type TicketCreateManyPreparedByUserInputEnvelope = {
    data: TicketCreateManyPreparedByUserInput | TicketCreateManyPreparedByUserInput[]
    skipDuplicates?: boolean
  }

  export type CustomerCreateWithoutRegisteredByUserInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    tickets?: TicketCreateNestedManyWithoutCustomerInput
    history?: CustomerHistoryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutRegisteredByUserInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    tickets?: TicketUncheckedCreateNestedManyWithoutCustomerInput
    history?: CustomerHistoryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutRegisteredByUserInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutRegisteredByUserInput, CustomerUncheckedCreateWithoutRegisteredByUserInput>
  }

  export type CustomerCreateManyRegisteredByUserInputEnvelope = {
    data: CustomerCreateManyRegisteredByUserInput | CustomerCreateManyRegisteredByUserInput[]
    skipDuplicates?: boolean
  }

  export type TicketUpsertWithWhereUniqueWithoutPreparedByUserInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutPreparedByUserInput, TicketUncheckedUpdateWithoutPreparedByUserInput>
    create: XOR<TicketCreateWithoutPreparedByUserInput, TicketUncheckedCreateWithoutPreparedByUserInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutPreparedByUserInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutPreparedByUserInput, TicketUncheckedUpdateWithoutPreparedByUserInput>
  }

  export type TicketUpdateManyWithWhereWithoutPreparedByUserInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutPreparedByUserInput>
  }

  export type TicketScalarWhereInput = {
    AND?: TicketScalarWhereInput | TicketScalarWhereInput[]
    OR?: TicketScalarWhereInput[]
    NOT?: TicketScalarWhereInput | TicketScalarWhereInput[]
    id?: StringFilter<"Ticket"> | string
    customerName?: StringFilter<"Ticket"> | string
    customerPhone?: StringNullableFilter<"Ticket"> | string | null
    paymentAmount?: FloatFilter<"Ticket"> | number
    status?: EnumTicketStatusFilter<"Ticket"> | $Enums.TicketStatus
    date?: StringFilter<"Ticket"> | string
    reasonForPayment?: StringNullableFilter<"Ticket"> | string | null
    preparedBy?: StringFilter<"Ticket"> | string
    ticketNumber?: StringFilter<"Ticket"> | string
    modeOfPayment?: EnumPaymentModeNullableFilter<"Ticket"> | $Enums.PaymentMode | null
    bankReceiptNo?: StringNullableFilter<"Ticket"> | string | null
    htmlContent?: StringNullableFilter<"Ticket"> | string | null
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    auditStatus?: EnumAuditStatusFilter<"Ticket"> | $Enums.AuditStatus
    auditedBy?: StringNullableFilter<"Ticket"> | string | null
    auditedAt?: DateTimeNullableFilter<"Ticket"> | Date | string | null
    auditNote?: StringNullableFilter<"Ticket"> | string | null
  }

  export type CustomerUpsertWithWhereUniqueWithoutRegisteredByUserInput = {
    where: CustomerWhereUniqueInput
    update: XOR<CustomerUpdateWithoutRegisteredByUserInput, CustomerUncheckedUpdateWithoutRegisteredByUserInput>
    create: XOR<CustomerCreateWithoutRegisteredByUserInput, CustomerUncheckedCreateWithoutRegisteredByUserInput>
  }

  export type CustomerUpdateWithWhereUniqueWithoutRegisteredByUserInput = {
    where: CustomerWhereUniqueInput
    data: XOR<CustomerUpdateWithoutRegisteredByUserInput, CustomerUncheckedUpdateWithoutRegisteredByUserInput>
  }

  export type CustomerUpdateManyWithWhereWithoutRegisteredByUserInput = {
    where: CustomerScalarWhereInput
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyWithoutRegisteredByUserInput>
  }

  export type CustomerScalarWhereInput = {
    AND?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    OR?: CustomerScalarWhereInput[]
    NOT?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    id?: StringFilter<"Customer"> | string
    fullName?: StringFilter<"Customer"> | string
    sex?: EnumSexFilter<"Customer"> | $Enums.Sex
    phoneNumber?: StringFilter<"Customer"> | string
    address?: StringNullableFilter<"Customer"> | string | null
    payersIdentification?: StringFilter<"Customer"> | string
    savingType?: StringFilter<"Customer"> | string
    loanType?: StringFilter<"Customer"> | string
    registrationDate?: StringFilter<"Customer"> | string
    isActive?: BoolFilter<"Customer"> | boolean
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    registeredBy?: StringFilter<"Customer"> | string
  }

  export type UserCreateWithoutCustomersInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart?: number | null
    ticketNumberEnd?: number | null
    currentTicketNumber?: number | null
    isActive?: boolean
    failedLoginAttempts?: number
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketCreateNestedManyWithoutPreparedByUserInput
  }

  export type UserUncheckedCreateWithoutCustomersInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart?: number | null
    ticketNumberEnd?: number | null
    currentTicketNumber?: number | null
    isActive?: boolean
    failedLoginAttempts?: number
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketUncheckedCreateNestedManyWithoutPreparedByUserInput
  }

  export type UserCreateOrConnectWithoutCustomersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCustomersInput, UserUncheckedCreateWithoutCustomersInput>
  }

  export type TicketCreateWithoutCustomerInput = {
    id?: string
    customerName: string
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
    preparedByUser?: UserCreateNestedOneWithoutTicketsInput
  }

  export type TicketUncheckedCreateWithoutCustomerInput = {
    id?: string
    customerName: string
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    preparedBy: string
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
  }

  export type TicketCreateOrConnectWithoutCustomerInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutCustomerInput, TicketUncheckedCreateWithoutCustomerInput>
  }

  export type TicketCreateManyCustomerInputEnvelope = {
    data: TicketCreateManyCustomerInput | TicketCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type CustomerHistoryCreateWithoutCustomerInput = {
    id?: string
    eventType: $Enums.HistoryEventType
    amount: number
    ticketNumber: string
    date: string
    preparedBy: string
    reasonForPayment?: string | null
    createdAt?: Date | string
  }

  export type CustomerHistoryUncheckedCreateWithoutCustomerInput = {
    id?: string
    eventType: $Enums.HistoryEventType
    amount: number
    ticketNumber: string
    date: string
    preparedBy: string
    reasonForPayment?: string | null
    createdAt?: Date | string
  }

  export type CustomerHistoryCreateOrConnectWithoutCustomerInput = {
    where: CustomerHistoryWhereUniqueInput
    create: XOR<CustomerHistoryCreateWithoutCustomerInput, CustomerHistoryUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerHistoryCreateManyCustomerInputEnvelope = {
    data: CustomerHistoryCreateManyCustomerInput | CustomerHistoryCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCustomersInput = {
    update: XOR<UserUpdateWithoutCustomersInput, UserUncheckedUpdateWithoutCustomersInput>
    create: XOR<UserCreateWithoutCustomersInput, UserUncheckedCreateWithoutCustomersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCustomersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCustomersInput, UserUncheckedUpdateWithoutCustomersInput>
  }

  export type UserUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUpdateManyWithoutPreparedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUncheckedUpdateManyWithoutPreparedByUserNestedInput
  }

  export type TicketUpsertWithWhereUniqueWithoutCustomerInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutCustomerInput, TicketUncheckedUpdateWithoutCustomerInput>
    create: XOR<TicketCreateWithoutCustomerInput, TicketUncheckedCreateWithoutCustomerInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutCustomerInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutCustomerInput, TicketUncheckedUpdateWithoutCustomerInput>
  }

  export type TicketUpdateManyWithWhereWithoutCustomerInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CustomerHistoryUpsertWithWhereUniqueWithoutCustomerInput = {
    where: CustomerHistoryWhereUniqueInput
    update: XOR<CustomerHistoryUpdateWithoutCustomerInput, CustomerHistoryUncheckedUpdateWithoutCustomerInput>
    create: XOR<CustomerHistoryCreateWithoutCustomerInput, CustomerHistoryUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerHistoryUpdateWithWhereUniqueWithoutCustomerInput = {
    where: CustomerHistoryWhereUniqueInput
    data: XOR<CustomerHistoryUpdateWithoutCustomerInput, CustomerHistoryUncheckedUpdateWithoutCustomerInput>
  }

  export type CustomerHistoryUpdateManyWithWhereWithoutCustomerInput = {
    where: CustomerHistoryScalarWhereInput
    data: XOR<CustomerHistoryUpdateManyMutationInput, CustomerHistoryUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CustomerHistoryScalarWhereInput = {
    AND?: CustomerHistoryScalarWhereInput | CustomerHistoryScalarWhereInput[]
    OR?: CustomerHistoryScalarWhereInput[]
    NOT?: CustomerHistoryScalarWhereInput | CustomerHistoryScalarWhereInput[]
    id?: StringFilter<"CustomerHistory"> | string
    eventType?: EnumHistoryEventTypeFilter<"CustomerHistory"> | $Enums.HistoryEventType
    amount?: FloatFilter<"CustomerHistory"> | number
    ticketNumber?: StringFilter<"CustomerHistory"> | string
    date?: StringFilter<"CustomerHistory"> | string
    preparedBy?: StringFilter<"CustomerHistory"> | string
    reasonForPayment?: StringNullableFilter<"CustomerHistory"> | string | null
    customerId?: StringFilter<"CustomerHistory"> | string
    createdAt?: DateTimeFilter<"CustomerHistory"> | Date | string
  }

  export type UserCreateWithoutTicketsInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart?: number | null
    ticketNumberEnd?: number | null
    currentTicketNumber?: number | null
    isActive?: boolean
    failedLoginAttempts?: number
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customers?: CustomerCreateNestedManyWithoutRegisteredByUserInput
  }

  export type UserUncheckedCreateWithoutTicketsInput = {
    id?: string
    name: string
    email: string
    password?: string | null
    role: $Enums.Role
    branchId: string
    ticketNumberStart?: number | null
    ticketNumberEnd?: number | null
    currentTicketNumber?: number | null
    isActive?: boolean
    failedLoginAttempts?: number
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customers?: CustomerUncheckedCreateNestedManyWithoutRegisteredByUserInput
  }

  export type UserCreateOrConnectWithoutTicketsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
  }

  export type CustomerCreateWithoutTicketsInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    registeredByUser?: UserCreateNestedOneWithoutCustomersInput
    history?: CustomerHistoryCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutTicketsInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    registeredBy: string
    history?: CustomerHistoryUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutTicketsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutTicketsInput, CustomerUncheckedCreateWithoutTicketsInput>
  }

  export type UserUpsertWithoutTicketsInput = {
    update: XOR<UserUpdateWithoutTicketsInput, UserUncheckedUpdateWithoutTicketsInput>
    create: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTicketsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTicketsInput, UserUncheckedUpdateWithoutTicketsInput>
  }

  export type UserUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customers?: CustomerUpdateManyWithoutRegisteredByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    branchId?: StringFieldUpdateOperationsInput | string
    ticketNumberStart?: NullableIntFieldUpdateOperationsInput | number | null
    ticketNumberEnd?: NullableIntFieldUpdateOperationsInput | number | null
    currentTicketNumber?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customers?: CustomerUncheckedUpdateManyWithoutRegisteredByUserNestedInput
  }

  export type CustomerUpsertWithoutTicketsInput = {
    update: XOR<CustomerUpdateWithoutTicketsInput, CustomerUncheckedUpdateWithoutTicketsInput>
    create: XOR<CustomerCreateWithoutTicketsInput, CustomerUncheckedCreateWithoutTicketsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutTicketsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutTicketsInput, CustomerUncheckedUpdateWithoutTicketsInput>
  }

  export type CustomerUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registeredByUser?: UserUpdateOneWithoutCustomersNestedInput
    history?: CustomerHistoryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registeredBy?: StringFieldUpdateOperationsInput | string
    history?: CustomerHistoryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateWithoutHistoryInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    registeredByUser?: UserCreateNestedOneWithoutCustomersInput
    tickets?: TicketCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutHistoryInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
    registeredBy: string
    tickets?: TicketUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutHistoryInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutHistoryInput, CustomerUncheckedCreateWithoutHistoryInput>
  }

  export type CustomerUpsertWithoutHistoryInput = {
    update: XOR<CustomerUpdateWithoutHistoryInput, CustomerUncheckedUpdateWithoutHistoryInput>
    create: XOR<CustomerCreateWithoutHistoryInput, CustomerUncheckedCreateWithoutHistoryInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutHistoryInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutHistoryInput, CustomerUncheckedUpdateWithoutHistoryInput>
  }

  export type CustomerUpdateWithoutHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registeredByUser?: UserUpdateOneWithoutCustomersNestedInput
    tickets?: TicketUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registeredBy?: StringFieldUpdateOperationsInput | string
    tickets?: TicketUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type TicketCreateManyPreparedByUserInput = {
    id?: string
    customerName: string
    customerPhone?: string | null
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
  }

  export type CustomerCreateManyRegisteredByUserInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    phoneNumber: string
    address?: string | null
    payersIdentification: string
    savingType: string
    loanType: string
    registrationDate: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type TicketUpdateWithoutPreparedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
    customer?: CustomerUpdateOneWithoutTicketsNestedInput
  }

  export type TicketUncheckedUpdateWithoutPreparedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketUncheckedUpdateManyWithoutPreparedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerUpdateWithoutRegisteredByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUpdateManyWithoutCustomerNestedInput
    history?: CustomerHistoryUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutRegisteredByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUncheckedUpdateManyWithoutCustomerNestedInput
    history?: CustomerHistoryUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateManyWithoutRegisteredByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    phoneNumber?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    payersIdentification?: StringFieldUpdateOperationsInput | string
    savingType?: StringFieldUpdateOperationsInput | string
    loanType?: StringFieldUpdateOperationsInput | string
    registrationDate?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateManyCustomerInput = {
    id?: string
    customerName: string
    paymentAmount: number
    status: $Enums.TicketStatus
    date: string
    reasonForPayment?: string | null
    preparedBy: string
    ticketNumber: string
    modeOfPayment?: $Enums.PaymentMode | null
    bankReceiptNo?: string | null
    htmlContent?: string | null
    createdAt?: Date | string
    auditStatus?: $Enums.AuditStatus
    auditedBy?: string | null
    auditedAt?: Date | string | null
    auditNote?: string | null
  }

  export type CustomerHistoryCreateManyCustomerInput = {
    id?: string
    eventType: $Enums.HistoryEventType
    amount: number
    ticketNumber: string
    date: string
    preparedBy: string
    reasonForPayment?: string | null
    createdAt?: Date | string
  }

  export type TicketUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
    preparedByUser?: UserUpdateOneWithoutTicketsNestedInput
  }

  export type TicketUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    preparedBy?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    paymentAmount?: FloatFieldUpdateOperationsInput | number
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus
    date?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    preparedBy?: StringFieldUpdateOperationsInput | string
    ticketNumber?: StringFieldUpdateOperationsInput | string
    modeOfPayment?: NullableEnumPaymentModeFieldUpdateOperationsInput | $Enums.PaymentMode | null
    bankReceiptNo?: NullableStringFieldUpdateOperationsInput | string | null
    htmlContent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditStatus?: EnumAuditStatusFieldUpdateOperationsInput | $Enums.AuditStatus
    auditedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerHistoryUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumHistoryEventTypeFieldUpdateOperationsInput | $Enums.HistoryEventType
    amount?: FloatFieldUpdateOperationsInput | number
    ticketNumber?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    preparedBy?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerHistoryUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumHistoryEventTypeFieldUpdateOperationsInput | $Enums.HistoryEventType
    amount?: FloatFieldUpdateOperationsInput | number
    ticketNumber?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    preparedBy?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerHistoryUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumHistoryEventTypeFieldUpdateOperationsInput | $Enums.HistoryEventType
    amount?: FloatFieldUpdateOperationsInput | number
    ticketNumber?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    preparedBy?: StringFieldUpdateOperationsInput | string
    reasonForPayment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}