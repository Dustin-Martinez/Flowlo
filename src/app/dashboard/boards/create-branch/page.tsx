// pages/create-branch/page.tsx - MAIN FILE
"use client";

import { useCreateBranch } from '@/src/app/hooks/useCreateBranch';
import { calculateTotalProgress } from '@/src/app/utils/create-branch.utils';

// Import components
import { LoadingState } from '@/src/components/create-branch/LoadingState';
import { ErrorState } from '@/src/components/create-branch/ErrorState';
import { Header } from '@/src/components/create-branch/Header';
import { StatsOverview } from '@/src/components/create-branch/StatsOverview';
import { TabsNavigation } from '@/src/components/create-branch/TabsNavigation';
import { BranchCard } from '@/src/components/create-branch/BranchCard';
import { NoBranchesState } from '@/src/components/create-branch/NoBranchesState';
import { BranchForm } from '@/src/components/create-branch/BranchForm';
import { DeleteModal } from '@/src/components/create-branch/DeleteModal';

export default function CreateBranchPage() {
  const {
    router,
    parentBoard,
    existingBranches,
    isLoading,
    isSubmitting,
    error,
    activeTab,
    showDeleteConfirm,
    showMenuForBranch,
    branchData,
    setBranchData,
    setActiveTab,
    setShowDeleteConfirm,
    setShowMenuForBranch,
    handleSubmit,
    handleAddTag,
    handleRemoveTag,
    handleAddTeamMember,
    handleRemoveTeamMember,
    handleViewBranch,
    handleViewMainBoard,
    handleEditBranch,
    handleDeleteBranch,
    handleToggleFavorite,
    handleDuplicateBranch
  } = useCreateBranch();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error && !parentBoard) {
    return <ErrorState error={error} onBack={() => router.push('/dashboard/boards')} />;
  }

  const totalProgress = calculateTotalProgress(existingBranches);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title="Branch Management"
        subtitle={`Manage specialized workflows for ${parentBoard?.title}`}
        onBack={() => router.back()}
        onViewMainBoard={handleViewMainBoard}
      />

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Overview Stats */}
          <StatsOverview
            branches={existingBranches}
            totalProgress={totalProgress}
          />

          {/* Tabs */}
          <TabsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            existingBranchesCount={existingBranches.length}
          />

          {/* Existing Branches Tab */}
          {activeTab === 'existing' && (
            <div>
              {existingBranches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {existingBranches.map((branch) => (
                    <BranchCard
                      key={branch.id}
                      branch={branch}
                      onView={handleViewBranch}
                      onEdit={handleEditBranch}
                      onToggleFavorite={handleToggleFavorite}
                      onDuplicate={handleDuplicateBranch}
                      onDelete={handleDeleteBranch}
                      showMenuForBranch={showMenuForBranch}
                      setShowMenuForBranch={setShowMenuForBranch}
                      setShowDeleteConfirm={setShowDeleteConfirm}
                    />
                  ))}
                </div>
              ) : (
                <NoBranchesState onCreateFirstBranch={() => setActiveTab('create')} />
              )}
            </div>
          )}

          {/* Create Branch Tab */}
          {activeTab === 'create' && (
            <BranchForm
              branchData={branchData}
              setBranchData={setBranchData}
              onSubmit={handleSubmit}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onAddTeamMember={handleAddTeamMember}
              onRemoveTeamMember={handleRemoveTeamMember}
              onCancel={() => setActiveTab('existing')}
              isSubmitting={isSubmitting}
              error={error}
              parentBoard={parentBoard}
              setActiveTab={setActiveTab}
              projectId={parentBoard?.projectId}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteModal
          branchId={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={handleDeleteBranch}
        />
      )}
    </div>
  );
}