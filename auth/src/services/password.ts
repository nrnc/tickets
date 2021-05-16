import * as argon2 from "argon2";
export class Password {
  static async toHash(password: string) {
    try {
      const hash = await argon2.hash(password);
      return hash;
    } catch (err) {
      throw new Error("Something wrong");
    }
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    return await argon2.verify(storedPassword, suppliedPassword);
  }
}
