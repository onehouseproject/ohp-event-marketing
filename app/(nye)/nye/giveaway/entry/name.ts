// The giveaway form asks for one name. HighLevel keeps a first and a last name, and the owner's
// emails greet by {{contact.first_name}}, so the route splits it: the first word is the first
// name and the rest, which may be empty, the last name. "Mary Ann Smith" becomes "Mary" and
// "Ann Smith", the accepted cost of one field.

export function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}
