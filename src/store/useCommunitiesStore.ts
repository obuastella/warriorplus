//@ts-nocheck
import { create } from "zustand";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../components/firebase";

const useCommunitiesStore = create((set, get) => ({
  // State
  communities: [],
  loading: false,
  error: null,
  selectedCommunity: null,

  // Actions
  fetchCommunities: async () => {
    set({ loading: true, error: null });

    try {
      const communitiesRef = collection(db, "Communities");
      const q = query(communitiesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const communitiesData = querySnapshot.docs.map((docSnap) => {
        const community = { id: docSnap.id, ...docSnap.data() };

        // Transform the data to match your component's expected format
        return {
          id: community.id,
          name: community.name,
          description: community.description,
          bannerImage:
            community.bannerImage || community.name.charAt(0).toUpperCase(),
          creatorName: community.createdBy?.displayName || "Unknown",
          creatorImage:
            community.createdBy?.photoURL ||
            community.createdBy?.displayName?.charAt(0).toUpperCase() ||
            "U",
          memberCount: community.memberCount || 0,
          members: community.members || [], // Include members array
          createdDate:
            community.createdAt?.toDate().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) || "Unknown",
          joined: false, // Will be updated when checking membership
          requiresPayment: community.requiresPayment || false,
          subscriptionTier: community.subscriptionTier || "basic",
          isPrivate: community.isPrivate || false,
          isActive: community.isActive || true,
          maxMembers: community.maxMembers || null,
          messages: [], // Messages will be fetched separately when needed
        };
      });

      set({
        communities: communitiesData,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching communities:", error);
      set({
        error: error.message,
        loading: false,
      });
    }
  },

  // Check if current user has joined a specific community
  checkUserMembership: async (communityId, userId) => {
    try {
      const communityRef = doc(db, "Communities", communityId);
      const communityDoc = await getDoc(communityRef);

      if (communityDoc.exists()) {
        const communityData = communityDoc.data();
        const isJoined = communityData.members?.includes(userId) || false;

        // Update the specific community's joined status
        const communities = get().communities;
        const updatedCommunities = communities.map((community) =>
          community.id === communityId
            ? { ...community, joined: isJoined }
            : community
        );

        set({ communities: updatedCommunities });

        return isJoined;
      }

      return false;
    } catch (error) {
      console.error("Error checking membership:", error);
      return false;
    }
  },

  // Check membership for all communities at once
  checkAllMemberships: async (userId) => {
    if (!userId) return;

    const communities = get().communities;
    const updatedCommunities = communities.map((community) => ({
      ...community,
      joined: community.members?.includes(userId) || false,
    }));

    set({ communities: updatedCommunities });
  },

  // Join a community
  joinCommunity: async (communityId, userId) => {
    try {
      const communityRef = doc(db, "communities", communityId);

      // Add user to community members and increment member count
      await updateDoc(communityRef, {
        members: arrayUnion(userId),
        memberCount: increment(1),
      });

      // Create a member document for additional data if needed
      const memberRef = doc(db, "communities", communityId, "members", userId);
      await addDoc(collection(db, "communities", communityId, "members"), {
        userId: userId,
        joinedAt: serverTimestamp(),
      });

      // Update local state
      const communities = get().communities;
      const updatedCommunities = communities.map((community) =>
        community.id === communityId
          ? {
              ...community,
              joined: true,
              memberCount: community.memberCount + 1,
            }
          : community
      );

      set({ communities: updatedCommunities });
    } catch (error) {
      console.error("Error joining community:", error);
      throw error;
    }
  },

  // Leave a community
  leaveCommunity: async (communityId, userId) => {
    try {
      const communityRef = doc(db, "Communities", communityId);

      // Remove user from community members and decrement member count
      await updateDoc(communityRef, {
        members: arrayRemove(userId),
        memberCount: increment(-1),
      });

      // Remove member document
      const membersQuery = query(
        collection(db, "Communities", communityId, "members"),
        where("userId", "==", userId)
      );
      const memberDocs = await getDocs(membersQuery);
      memberDocs.forEach(async (memberDoc) => {
        await deleteDoc(memberDoc.ref);
      });

      // Update local state
      const communities = get().communities;
      const updatedCommunities = communities.map((community) =>
        community.id === communityId
          ? {
              ...community,
              joined: false,
              memberCount: Math.max(0, community.memberCount - 1),
            }
          : community
      );

      set({ communities: updatedCommunities });
    } catch (error) {
      console.error("Error leaving community:", error);
      throw error;
    }
  },

  // Create a new community
  createCommunity: async (communityData, userId, userProfile) => {
    set({ loading: true, error: null });

    try {
      const newCommunityData = {
        ...communityData,
        createdBy: {
          uid: userId,
          displayName: userProfile.displayName,
          email: userProfile.email,
        },
        createdAt: serverTimestamp(),
        members: [userId], // Creator automatically joins
        memberCount: 1,
        isActive: true,
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "communities"),
        newCommunityData
      );

      // Transform and add to local state
      const newCommunity = {
        id: docRef.id,
        name: communityData.name,
        description: communityData.description,
        bannerImage:
          communityData.bannerImage ||
          communityData.name.charAt(0).toUpperCase(),
        creatorName: userProfile.displayName || "Unknown",
        creatorImage:
          userProfile.photoURL ||
          userProfile.displayName?.charAt(0).toUpperCase() ||
          "U",
        memberCount: 1,
        createdDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        joined: true, // Creator automatically joins
        requiresPayment: communityData.requiresPayment || false,
        subscriptionTier: communityData.subscriptionTier || "basic",
        isPrivate: communityData.isPrivate || false,
        isActive: true,
        maxMembers: communityData.maxMembers || null,
        messages: [],
      };

      const communities = get().communities;
      set({
        communities: [newCommunity, ...communities],
        loading: false,
      });

      return newCommunity;
    } catch (error) {
      console.error("Error creating community:", error);
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Update a community
  updateCommunity: async (communityId, updateData) => {
    try {
      const communityRef = doc(db, "communities", communityId);
      await updateDoc(communityRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      // Update local state
      const communities = get().communities;
      const updatedCommunities = communities.map((community) =>
        community.id === communityId
          ? { ...community, ...updateData }
          : community
      );

      set({ communities: updatedCommunities });
    } catch (error) {
      console.error("Error updating community:", error);
      throw error;
    }
  },

  // Delete a community
  deleteCommunity: async (communityId) => {
    try {
      await deleteDoc(doc(db, "communities", communityId));

      // Remove from local state
      const communities = get().communities;
      const updatedCommunities = communities.filter(
        (community) => community.id !== communityId
      );

      set({ communities: updatedCommunities });
    } catch (error) {
      console.error("Error deleting community:", error);
      throw error;
    }
  },

  // Set selected community for detailed view
  setSelectedCommunity: (community) => {
    set({ selectedCommunity: community });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({
      communities: [],
      loading: false,
      error: null,
      selectedCommunity: null,
    });
  },
}));

export default useCommunitiesStore;
