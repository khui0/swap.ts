export async function load({ locals }) {
  if (locals.user && locals.session) {
    return {};
  }
}
