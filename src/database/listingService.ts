import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { Listing } from "./Listing";

export async function fetchListings(): Promise<Listing[]> {
  const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Listing[];
}
