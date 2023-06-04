import { network } from "../flow/config";
import { supabase } from "../supabaseClient";

// note: the `!inner` hint makes it so you filter on the parent rows if the network isnt correct
export async function fetchAllProposals() {
  const { data } = await supabase.from('events')
    .select(`
      project_id,
      projects!inner (
        network
      )
    `)
    .eq('projects.network', network)
    .or('type.eq.AddSigner,type.eq.RemoveSigner,type.eq.UpdateThreshold,type.eq.Mint,type.eq.Withdraw,type.eq.BatchWithdraw,type.eq.BatchMint');

  if (!data || !data.length) {
    return []
  }
  return data;
};
