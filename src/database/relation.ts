import * as schema from '@/database/schema';
import { defineRelations } from 'drizzle-orm';

export const relations = defineRelations(schema, (r) => ({
  userTable: {
    sectors: r.many.sectorTable({
      from: r.userTable.id,
      to: r.sectorTable.assignedCouncilorId,
      alias: 'councilor_sectors',
    }),
    committees: r.many.committeeTable({
      from: r.userTable.id,
      to: r.committeeTable.assignedCouncilorId,
      alias: 'councilor_committees',
    }),
    disbursementApprovedVouchers: r.many.disbursementVoucherTable({
      from: r.userTable.id,
      to: r.disbursementVoucherTable.approvedById,
      alias: 'disbursement_approved_by_user',
    }),
    disbursementPreparedVouchers: r.many.disbursementVoucherTable({
      from: r.userTable.id,
      to: r.disbursementVoucherTable.preparedById,
      alias: 'disbursement_prepared_by_user',
    }),
    officialIssuedReceipts: r.many.officialReceiptTable({
      from: r.userTable.id,
      to: r.officialReceiptTable.issuedById,
      alias: 'official_receipt_issued_by_user',
    }),
    announcements: r.many.announcementTable({
      from: r.userTable.id,
      to: r.announcementTable.postedById,
      alias: 'announcement_posted_by_user',
    }),
  },

  sectorTable: {
    user: r.one.userTable({
      from: r.sectorTable.id,
      to: r.userTable.id,
      alias: 'coucilor_sectors',
    }),
    households: r.many.householdTable({
      from: r.sectorTable.id,
      to: r.householdTable.sectorId,
      alias: 'sector_households',
    }),
  },

  householdTable: {
    sector: r.one.sectorTable({
      from: r.householdTable.sectorId,
      to: r.sectorTable.id,
      alias: 'sector_households',
    }),
    members: r.many.residentTable({
      from: r.householdTable.id,
      to: r.residentTable.householdId,
      alias: 'household_members',
    }),
  },

  residentTable: {
    household: r.one.householdTable({
      from: r.residentTable.householdId,
      to: r.householdTable.id,
      alias: 'household_members',
    }),
    documentRequests: r.many.documentRequestTable({
      from: r.residentTable.id,
      to: r.documentRequestTable.residentId,
      alias: 'resident_document_requests',
    }),
    officialReceipts: r.many.officialReceiptTable({
      from: r.residentTable.id,
      to: r.officialReceiptTable.payorId,
      alias: 'resident_official_receipts',
    }),
  },

  committeeTable: {
    user: r.one.userTable({
      from: r.committeeTable.assignedCouncilorId,
      to: r.userTable.id,
      alias: 'coucilor_committees',
    }),
    members: r.many.committeeMemberTable({
      from: r.committeeTable.id,
      to: r.committeeMemberTable.committeeId,
      alias: 'committee_members',
    }),
    projects: r.many.committeeProjectTable({
      from: r.committeeTable.id,
      to: r.committeeProjectTable.committeeId,
      alias: 'committee_projects',
    }),
  },

  committeeMemberTable: {
    committee: r.one.committeeTable({
      from: r.committeeMemberTable.committeeId,
      to: r.committeeTable.id,
      alias: 'committee_members',
    }),
  },

  committeeProjectTable: {
    committee: r.one.committeeTable({
      from: r.committeeProjectTable.committeeId,
      to: r.committeeTable.id,
      alias: 'committee_projects',
    }),
  },

  disbursementVoucherTable: {
    disbursementApprovedVoucher: r.one.userTable({
      from: r.disbursementVoucherTable.approvedById,
      to: r.userTable.id,
      alias: 'disbursement_approved_by_user',
    }),
    disbursementPreparedVoucher: r.one.userTable({
      from: r.disbursementVoucherTable.preparedById,
      to: r.userTable.id,
      alias: 'disbursement_prepared_by_user',
    }),
  },

  officialReceiptTable: {
    user: r.one.userTable({
      from: r.officialReceiptTable.issuedById,
      to: r.userTable.id,
      alias: 'official_receipt_issued_by_user',
    }),
    resident: r.one.residentTable({
      from: r.officialReceiptTable.payorId,
      to: r.residentTable.id,
      alias: 'resident_official_receipts',
    }),
  },

  announcementTable: {
    user: r.one.userTable({
      from: r.announcementTable.postedById,
      to: r.userTable.id,
      alias: 'announcement_posted_by_user',
    }),
  },
}));
