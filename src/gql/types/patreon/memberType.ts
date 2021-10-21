export default `
  type PatreonMember {
    "One of active_patron, declined_patron, former_patron. A null value indicates the member has never pledged. Can be null."
    status:	String

    "The ID of the member"
    id: ID!

    " The total amount that the member has ever paid to the campaign. 0 if never paid."
    totalHistoricalAmountCents: Int

    " The creator's notes on the member."
    note: String

    "The Patreon User"
    user: PatreonUser
  }
`;
