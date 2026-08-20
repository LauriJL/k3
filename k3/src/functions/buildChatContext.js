import { getDatabase, ref, get } from "firebase/database";
import calculateCategorySums from "./categorySums";

async function fetchPath(db, path) {
  const snapshot = await get(ref(db, path));
  return snapshot.val();
}

function formatCategoryList(categories) {
  if (!categories) return "Ei luokkia.";
  return Object.values(categories)
    .map((cat) => cat.name)
    .join(", ");
}

function sumItems(items, field = "summa") {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => total + parseFloat(item[field] || 0), 0);
}

function formatExpenseSummary(items) {
  const paid = items.filter((item) => item.maksupvm && item.maksupvm.length > 0);
  const upcoming = items.filter(
    (item) => !item.maksupvm || item.maksupvm.length === 0
  );

  const paidByCategory = calculateCategorySums(paid);
  const upcomingByCategory = calculateCategorySums(upcoming);

  const paidLines = paidByCategory
    .map((cat) => `  - ${cat.luokka}: ${cat.summa.toFixed(2)} €`)
    .join("\n");
  const upcomingLines = upcomingByCategory
    .map((cat) => `  - ${cat.luokka}: ${cat.summa.toFixed(2)} €`)
    .join("\n");

  return {
    paidTotal: sumItems(paid),
    upcomingTotal: sumItems(upcoming),
    paidCount: paid.length,
    upcomingCount: upcoming.length,
    paidLines: paidLines || "  (ei maksettuja menoja)",
    upcomingLines: upcomingLines || "  (ei tulevia menoja)",
    recentPaid: paid.slice(0, 10).map((item) => ({
      saaja: item.saaja,
      summa: item.summa,
      maksuluokka: item.maksuluokka,
      maksupvm: item.maksupvm,
    })),
    recentUpcoming: upcoming.slice(0, 10).map((item) => ({
      saaja: item.saaja,
      summa: item.summa,
      maksuluokka: item.maksuluokka,
      erapvm: item.erapvm,
    })),
  };
}

function formatIncomeSummary(items) {
  const lines = items.slice(0, 15).map(
    (item) =>
      `  - ${item.maksaja}: ${parseFloat(item.summa || 0).toFixed(2)} € (${item.tuloluokka}, ${item.maksupvm || "—"})`
  );

  return {
    total: sumItems(items),
    count: items.length,
    lines: lines.join("\n") || "  (ei tuloja)",
  };
}

async function buildChatContext(year) {
  const db = getDatabase();

  const [menotRaw, tulotRaw, saldo, prevSaldo, budget, menoluokat, tuloluokat] =
    await Promise.all([
      fetchPath(db, `menot/${year}`),
      fetchPath(db, `tulot/${year}`),
      fetchPath(db, `saldo/${year}`),
      fetchPath(db, `loppusaldo/${year - 1}/saldo`),
      fetchPath(db, `budjetti/${year}`),
      fetchPath(db, "menoluokat"),
      fetchPath(db, "tuloluokat"),
    ]);

  const menot = menotRaw
    ? Object.entries(menotRaw).map(([id, data]) => ({ id, ...data }))
    : [];
  const tulot = tulotRaw
    ? Object.entries(tulotRaw).map(([id, data]) => ({ id, ...data }))
    : [];

  const expenses = formatExpenseSummary(menot);
  const income = formatIncomeSummary(tulot);

  const balance = saldo?.saldo ?? "—";
  const balanceDate = saldo?.pvm ?? "—";
  const prevBalance = prevSaldo ?? 0;
  const budgetIncome = budget?.tulot ?? "—";
  const budgetExpenses = budget?.menot ?? "—";
  const netDiff = income.total + parseFloat(prevBalance || 0) - expenses.paidTotal;

  const summary = `Saldo: ${balance} € (päivitetty ${balanceDate})
Edellisen vuoden (${year - 1}) loppusaldo: ${prevBalance} €

Tulot yhteensä: ${income.total.toFixed(2)} € (${income.count} kpl)
${income.lines}

Maksetut menot yhteensä: ${expenses.paidTotal.toFixed(2)} € (${expenses.paidCount} kpl)
Maksuluokittain:
${expenses.paidLines}

Tulevat menot yhteensä: ${expenses.upcomingTotal.toFixed(2)} € (${expenses.upcomingCount} kpl)
Maksuluokittain:
${expenses.upcomingLines}

Erotus (tulot + ed. loppusaldo - maksetut menot): ${netDiff.toFixed(2)} €

Budjetti ${year}: tulot ${budgetIncome} €, menot ${budgetExpenses} €

Menoluokat: ${formatCategoryList(menoluokat)}
Tuloluokat: ${formatCategoryList(tuloluokat)}`;

  return { year, summary };
}

export default buildChatContext;
