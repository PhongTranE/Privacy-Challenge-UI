import { useEffect } from "react";
import { useRankingStore } from "@/stores/rankingStore";
import { fetchPublicRanking, fetchGroupSubmissionFiles, getAttackListByGroup, getAttackedFiles } from "@/services/api/rankingApi";

export const usePublicRanking = () => {
  const ranking = useRankingStore((s) => s.ranking);
  const rankingLoading = useRankingStore((s) => s.rankingLoading);
  const rankingError = useRankingStore((s) => s.rankingError);
  const setRanking = useRankingStore((s) => s.setRanking);
  const setRankingLoading = useRankingStore((s) => s.setRankingLoading);
  const setRankingError = useRankingStore((s) => s.setRankingError);

  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      if (!ranking || ranking.length === 0) setRankingLoading(true);
      try {
        const res = await fetchPublicRanking();
        if (isMounted) {
          if (JSON.stringify(res.data) !== JSON.stringify(ranking)) {
            setRanking(res.data || []);
          }
          setRankingError(null);
        }
      } catch (err: any) {
        if (isMounted) setRankingError(err?.message || "Error fetching ranking");
      } finally {
        if (isMounted) setRankingLoading(false);
      }
    };
    fetchData();
    interval = setInterval(fetchData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRanking, setRankingLoading, setRankingError]);

  const isLoading = rankingLoading && (!ranking || ranking.length === 0);

  return { data: { data: ranking }, isLoading, error: rankingError };
};

export const useGroupSubmissionFiles = (groupId?: number) => {
  const files = useRankingStore(s => (groupId ? s.groupSubmissionFilesByTeam[groupId] : undefined));
  const loading = useRankingStore(s => (groupId ? s.groupSubmissionFilesLoadingByTeam[groupId] : false));
  const error = useRankingStore(s => (groupId ? s.groupSubmissionFilesErrorByTeam[groupId] : null));
  const setFiles = useRankingStore(s => s.setGroupSubmissionFilesByTeam);
  const setLoading = useRankingStore(s => s.setGroupSubmissionFilesLoadingByTeam);
  const setError = useRankingStore(s => s.setGroupSubmissionFilesErrorByTeam);

  useEffect(() => {
    if (!groupId) return;
    let isMounted = true;
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      if (!files || files.length === 0) setLoading(groupId, true);
      setError(groupId, null);
      try {
        const res = await fetchGroupSubmissionFiles(groupId);
        if (isMounted) setFiles(groupId, res.data ?? []);
      } catch (e: any) {
        if (isMounted) setError(groupId, e?.message || 'Error fetching submission files');
      } finally {
        if (isMounted) setLoading(groupId, false);
      }
    };
    fetchData();
    interval = setInterval(fetchData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [groupId, setFiles, setLoading, setError]);

  const isLoading = loading && (!files || files.length === 0);

  return { data: files, loading: isLoading, error };
};

export const useAttackListByGroup = (groupId?: number) => {
  const data = useRankingStore(s => (groupId ? s.attackListByGroup[groupId] : undefined));
  const loading = useRankingStore(s => (groupId ? s.attackListLoadingByGroup[groupId] : false));
  const error = useRankingStore(s => (groupId ? s.attackListErrorByGroup[groupId] : null));
  const setData = useRankingStore(s => s.setAttackListByGroup);
  const setLoading = useRankingStore(s => s.setAttackListLoadingByGroup);
  const setError = useRankingStore(s => s.setAttackListErrorByGroup);

  useEffect(() => {
    if (!groupId) return;
    let isMounted = true;
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      if (!data) setLoading(groupId, true);
      setError(groupId, null);
      try {
        const res = await getAttackListByGroup(groupId);
        if (isMounted) setData(groupId, res.data ?? []);
      } catch (e: any) {
        if (isMounted) setError(groupId, e?.message || 'Error fetching attack list');
      } finally {
        if (isMounted) setLoading(groupId, false);
      }
    };
    fetchData();
    interval = setInterval(fetchData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [groupId, setData, setLoading, setError]);

  const isLoading = loading && !data;
  return { data, loading: isLoading, error };
};

export const useAttackedFiles = (groupIdAttack?: number, groupIdDefense?: number) => {
  const key = groupIdAttack && groupIdDefense ? `${groupIdAttack}-${groupIdDefense}` : undefined;
  const data = useRankingStore(s => (key ? s.attackedFiles[key] : undefined));
  const loading = useRankingStore(s => (key ? s.attackedFilesLoading[key] : false));
  const error = useRankingStore(s => (key ? s.attackedFilesError[key] : null));
  const setData = useRankingStore(s => s.setAttackedFiles);
  const setLoading = useRankingStore(s => s.setAttackedFilesLoading);
  const setError = useRankingStore(s => s.setAttackedFilesError);

  useEffect(() => {
    if (!groupIdAttack || !groupIdDefense) return;
    let isMounted = true;
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      if (!data) setLoading(key!, true);
      setError(key!, null);
      try {
        const res = await getAttackedFiles(groupIdAttack, groupIdDefense);
        if (isMounted) setData(key!, res.data ?? []);
      } catch (e: any) {
        if (isMounted) setError(key!, e?.message || 'Error fetching attacked files');
      } finally {
        if (isMounted) setLoading(key!, false);
      }
    };
    fetchData();
    interval = setInterval(fetchData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [groupIdAttack, groupIdDefense, key, setData, setLoading, setError]);

  const isLoading = loading && !data;
  return { data, loading: isLoading, error };
};

