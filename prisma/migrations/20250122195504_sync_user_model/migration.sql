/*
  Warnings:

  - You are about to drop the `AIPhoneCallConfiguration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApiKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `App` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `App_RoutingForms_Form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `App_RoutingForms_FormResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssignmentReason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingReference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingSeat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CalendarCache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Credential` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DSyncData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DSyncTeamGroupMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deployment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DestinationCalendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DomainWideDelegation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventTypeCustomInput` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventTypeTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HashedLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Host` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Impersonations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InstantMeetingToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationsSubscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OAuthClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OutOfOfficeEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OutOfOfficeReason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformAuthorizationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformBilling` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformOAuthClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RateLimit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReminderMail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResetPasswordRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecondaryEmail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelectedCalendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelectedSlots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TempOrgRedirect` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TravelSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPassword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerifiedEmail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerifiedNumber` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Watchlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Webhook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebhookScheduledTriggers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workflow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowReminder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowsOnEventTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowsOnTeams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkspacePlatform` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PlatformOAuthClientToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_user_eventtype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `avatars` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('ID_PASSWORD', 'GOOGLE');

-- DropForeignKey
ALTER TABLE "AIPhoneCallConfiguration" DROP CONSTRAINT "AIPhoneCallConfiguration_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "AccessCode" DROP CONSTRAINT "AccessCode_clientId_fkey";

-- DropForeignKey
ALTER TABLE "AccessCode" DROP CONSTRAINT "AccessCode_teamId_fkey";

-- DropForeignKey
ALTER TABLE "AccessCode" DROP CONSTRAINT "AccessCode_userId_fkey";

-- DropForeignKey
ALTER TABLE "AccessToken" DROP CONSTRAINT "AccessToken_platformOAuthClientId_fkey";

-- DropForeignKey
ALTER TABLE "AccessToken" DROP CONSTRAINT "AccessToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_appId_fkey";

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_teamId_fkey";

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropForeignKey
ALTER TABLE "App_RoutingForms_Form" DROP CONSTRAINT "App_RoutingForms_Form_teamId_fkey";

-- DropForeignKey
ALTER TABLE "App_RoutingForms_Form" DROP CONSTRAINT "App_RoutingForms_Form_userId_fkey";

-- DropForeignKey
ALTER TABLE "App_RoutingForms_FormResponse" DROP CONSTRAINT "App_RoutingForms_FormResponse_formId_fkey";

-- DropForeignKey
ALTER TABLE "App_RoutingForms_FormResponse" DROP CONSTRAINT "App_RoutingForms_FormResponse_routedToBookingUid_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentReason" DROP CONSTRAINT "AssignmentReason_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_teamId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeOption" DROP CONSTRAINT "AttributeOption_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeToUser" DROP CONSTRAINT "AttributeToUser_attributeOptionId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeToUser" DROP CONSTRAINT "AttributeToUser_createdByDSyncId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeToUser" DROP CONSTRAINT "AttributeToUser_createdById_fkey";

-- DropForeignKey
ALTER TABLE "AttributeToUser" DROP CONSTRAINT "AttributeToUser_memberId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeToUser" DROP CONSTRAINT "AttributeToUser_updatedByDSyncId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeToUser" DROP CONSTRAINT "AttributeToUser_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_userId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_destinationCalendarId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_reassignById_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "BookingReference" DROP CONSTRAINT "BookingReference_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingReference" DROP CONSTRAINT "BookingReference_credentialId_fkey";

-- DropForeignKey
ALTER TABLE "BookingReference" DROP CONSTRAINT "BookingReference_domainWideDelegationCredentialId_fkey";

-- DropForeignKey
ALTER TABLE "BookingSeat" DROP CONSTRAINT "BookingSeat_attendeeId_fkey";

-- DropForeignKey
ALTER TABLE "BookingSeat" DROP CONSTRAINT "BookingSeat_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarCache" DROP CONSTRAINT "CalendarCache_credentialId_fkey";

-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_appId_fkey";

-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_userId_fkey";

-- DropForeignKey
ALTER TABLE "DSyncData" DROP CONSTRAINT "DSyncData_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "DSyncTeamGroupMapping" DROP CONSTRAINT "DSyncTeamGroupMapping_directoryId_fkey";

-- DropForeignKey
ALTER TABLE "DSyncTeamGroupMapping" DROP CONSTRAINT "DSyncTeamGroupMapping_teamId_fkey";

-- DropForeignKey
ALTER TABLE "DestinationCalendar" DROP CONSTRAINT "DestinationCalendar_credentialId_fkey";

-- DropForeignKey
ALTER TABLE "DestinationCalendar" DROP CONSTRAINT "DestinationCalendar_domainWideDelegationCredentialId_fkey";

-- DropForeignKey
ALTER TABLE "DestinationCalendar" DROP CONSTRAINT "DestinationCalendar_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "DestinationCalendar" DROP CONSTRAINT "DestinationCalendar_userId_fkey";

-- DropForeignKey
ALTER TABLE "DomainWideDelegation" DROP CONSTRAINT "DomainWideDelegation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "DomainWideDelegation" DROP CONSTRAINT "DomainWideDelegation_workspacePlatformId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_instantMeetingScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_parentId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_profileId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_secondaryEmailId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_teamId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventTypeCustomInput" DROP CONSTRAINT "EventTypeCustomInput_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "EventTypeTranslation" DROP CONSTRAINT "EventTypeTranslation_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "EventTypeTranslation" DROP CONSTRAINT "EventTypeTranslation_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "EventTypeTranslation" DROP CONSTRAINT "EventTypeTranslation_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "HashedLink" DROP CONSTRAINT "HashedLink_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Host" DROP CONSTRAINT "Host_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Host" DROP CONSTRAINT "Host_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Host" DROP CONSTRAINT "Host_userId_fkey";

-- DropForeignKey
ALTER TABLE "Impersonations" DROP CONSTRAINT "Impersonations_impersonatedById_fkey";

-- DropForeignKey
ALTER TABLE "Impersonations" DROP CONSTRAINT "Impersonations_impersonatedUserId_fkey";

-- DropForeignKey
ALTER TABLE "InstantMeetingToken" DROP CONSTRAINT "InstantMeetingToken_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "InstantMeetingToken" DROP CONSTRAINT "InstantMeetingToken_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationsSubscriptions" DROP CONSTRAINT "NotificationsSubscriptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationSettings" DROP CONSTRAINT "OrganizationSettings_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OutOfOfficeEntry" DROP CONSTRAINT "OutOfOfficeEntry_reasonId_fkey";

-- DropForeignKey
ALTER TABLE "OutOfOfficeEntry" DROP CONSTRAINT "OutOfOfficeEntry_toUserId_fkey";

-- DropForeignKey
ALTER TABLE "OutOfOfficeEntry" DROP CONSTRAINT "OutOfOfficeEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "OutOfOfficeReason" DROP CONSTRAINT "OutOfOfficeReason_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_appId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformAuthorizationToken" DROP CONSTRAINT "PlatformAuthorizationToken_platformOAuthClientId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformAuthorizationToken" DROP CONSTRAINT "PlatformAuthorizationToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformBilling" DROP CONSTRAINT "PlatformBilling_id_fkey";

-- DropForeignKey
ALTER TABLE "PlatformOAuthClient" DROP CONSTRAINT "PlatformOAuthClient_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "RateLimit" DROP CONSTRAINT "RateLimit_apiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_platformOAuthClientId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "SecondaryEmail" DROP CONSTRAINT "SecondaryEmail_userId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedCalendar" DROP CONSTRAINT "SelectedCalendar_credentialId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedCalendar" DROP CONSTRAINT "SelectedCalendar_domainWideDelegationCredentialId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedCalendar" DROP CONSTRAINT "SelectedCalendar_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedCalendar" DROP CONSTRAINT "SelectedCalendar_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_createdByOAuthClientId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_parentId_fkey";

-- DropForeignKey
ALTER TABLE "TeamFeatures" DROP CONSTRAINT "TeamFeatures_featureId_fkey";

-- DropForeignKey
ALTER TABLE "TeamFeatures" DROP CONSTRAINT "TeamFeatures_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TravelSchedule" DROP CONSTRAINT "TravelSchedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeatures" DROP CONSTRAINT "UserFeatures_featureId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeatures" DROP CONSTRAINT "UserFeatures_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPassword" DROP CONSTRAINT "UserPassword_userId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_secondaryEmailId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_teamId_fkey";

-- DropForeignKey
ALTER TABLE "VerifiedEmail" DROP CONSTRAINT "VerifiedEmail_teamId_fkey";

-- DropForeignKey
ALTER TABLE "VerifiedEmail" DROP CONSTRAINT "VerifiedEmail_userId_fkey";

-- DropForeignKey
ALTER TABLE "VerifiedNumber" DROP CONSTRAINT "VerifiedNumber_teamId_fkey";

-- DropForeignKey
ALTER TABLE "VerifiedNumber" DROP CONSTRAINT "VerifiedNumber_userId_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_appId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_platformOAuthClientId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_userId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookScheduledTriggers" DROP CONSTRAINT "WebhookScheduledTriggers_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "WebhookScheduledTriggers" DROP CONSTRAINT "WebhookScheduledTriggers_webhookId_fkey";

-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowReminder" DROP CONSTRAINT "WorkflowReminder_bookingUid_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowReminder" DROP CONSTRAINT "WorkflowReminder_workflowStepId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowStep" DROP CONSTRAINT "WorkflowStep_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowsOnEventTypes" DROP CONSTRAINT "WorkflowsOnEventTypes_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowsOnEventTypes" DROP CONSTRAINT "WorkflowsOnEventTypes_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowsOnTeams" DROP CONSTRAINT "WorkflowsOnTeams_teamId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowsOnTeams" DROP CONSTRAINT "WorkflowsOnTeams_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "_PlatformOAuthClientToUser" DROP CONSTRAINT "_PlatformOAuthClientToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlatformOAuthClientToUser" DROP CONSTRAINT "_PlatformOAuthClientToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_user_eventtype" DROP CONSTRAINT "_user_eventtype_A_fkey";

-- DropForeignKey
ALTER TABLE "_user_eventtype" DROP CONSTRAINT "_user_eventtype_B_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_movedToProfileId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizationId_fkey";

-- DropTable
DROP TABLE "AIPhoneCallConfiguration";

-- DropTable
DROP TABLE "AccessCode";

-- DropTable
DROP TABLE "AccessToken";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "ApiKey";

-- DropTable
DROP TABLE "App";

-- DropTable
DROP TABLE "App_RoutingForms_Form";

-- DropTable
DROP TABLE "App_RoutingForms_FormResponse";

-- DropTable
DROP TABLE "AssignmentReason";

-- DropTable
DROP TABLE "Attendee";

-- DropTable
DROP TABLE "Attribute";

-- DropTable
DROP TABLE "AttributeOption";

-- DropTable
DROP TABLE "AttributeToUser";

-- DropTable
DROP TABLE "Availability";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "BookingReference";

-- DropTable
DROP TABLE "BookingSeat";

-- DropTable
DROP TABLE "CalendarCache";

-- DropTable
DROP TABLE "Credential";

-- DropTable
DROP TABLE "DSyncData";

-- DropTable
DROP TABLE "DSyncTeamGroupMapping";

-- DropTable
DROP TABLE "Deployment";

-- DropTable
DROP TABLE "DestinationCalendar";

-- DropTable
DROP TABLE "DomainWideDelegation";

-- DropTable
DROP TABLE "EventType";

-- DropTable
DROP TABLE "EventTypeCustomInput";

-- DropTable
DROP TABLE "EventTypeTranslation";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "HashedLink";

-- DropTable
DROP TABLE "Host";

-- DropTable
DROP TABLE "Impersonations";

-- DropTable
DROP TABLE "InstantMeetingToken";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "NotificationsSubscriptions";

-- DropTable
DROP TABLE "OAuthClient";

-- DropTable
DROP TABLE "OrganizationSettings";

-- DropTable
DROP TABLE "OutOfOfficeEntry";

-- DropTable
DROP TABLE "OutOfOfficeReason";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PlatformAuthorizationToken";

-- DropTable
DROP TABLE "PlatformBilling";

-- DropTable
DROP TABLE "PlatformOAuthClient";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "RateLimit";

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "ReminderMail";

-- DropTable
DROP TABLE "ResetPasswordRequest";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "SecondaryEmail";

-- DropTable
DROP TABLE "SelectedCalendar";

-- DropTable
DROP TABLE "SelectedSlots";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamFeatures";

-- DropTable
DROP TABLE "TempOrgRedirect";

-- DropTable
DROP TABLE "TravelSchedule";

-- DropTable
DROP TABLE "UserFeatures";

-- DropTable
DROP TABLE "UserPassword";

-- DropTable
DROP TABLE "VerificationToken";

-- DropTable
DROP TABLE "VerifiedEmail";

-- DropTable
DROP TABLE "VerifiedNumber";

-- DropTable
DROP TABLE "Watchlist";

-- DropTable
DROP TABLE "Webhook";

-- DropTable
DROP TABLE "WebhookScheduledTriggers";

-- DropTable
DROP TABLE "Workflow";

-- DropTable
DROP TABLE "WorkflowReminder";

-- DropTable
DROP TABLE "WorkflowStep";

-- DropTable
DROP TABLE "WorkflowsOnEventTypes";

-- DropTable
DROP TABLE "WorkflowsOnTeams";

-- DropTable
DROP TABLE "WorkspacePlatform";

-- DropTable
DROP TABLE "_PlatformOAuthClientToUser";

-- DropTable
DROP TABLE "_user_eventtype";

-- DropTable
DROP TABLE "avatars";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "AccessScope";

-- DropEnum
DROP TYPE "AppCategories";

-- DropEnum
DROP TYPE "AssignmentReasonEnum";

-- DropEnum
DROP TYPE "AttributeType";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "EventTypeAutoTranslatedField";

-- DropEnum
DROP TYPE "EventTypeCustomInputType";

-- DropEnum
DROP TYPE "FeatureType";

-- DropEnum
DROP TYPE "IdentityProvider";

-- DropEnum
DROP TYPE "MembershipRole";

-- DropEnum
DROP TYPE "PaymentOption";

-- DropEnum
DROP TYPE "PeriodType";

-- DropEnum
DROP TYPE "RedirectType";

-- DropEnum
DROP TYPE "ReminderType";

-- DropEnum
DROP TYPE "SMSLockState";

-- DropEnum
DROP TYPE "SchedulingType";

-- DropEnum
DROP TYPE "TimeUnit";

-- DropEnum
DROP TYPE "UserPermissionRole";

-- DropEnum
DROP TYPE "WatchlistSeverity";

-- DropEnum
DROP TYPE "WatchlistType";

-- DropEnum
DROP TYPE "WebhookTriggerEvents";

-- DropEnum
DROP TYPE "WorkflowActions";

-- DropEnum
DROP TYPE "WorkflowMethods";

-- DropEnum
DROP TYPE "WorkflowTemplates";

-- DropEnum
DROP TYPE "WorkflowTriggerEvents";

-- CreateTable
CREATE TABLE "auth.User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL DEFAULT '',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "loginType" "LoginType" NOT NULL DEFAULT 'ID_PASSWORD',
    "resetPasswordToken" TEXT,
    "resetPasswordExpiry" TIMESTAMP(3),
    "emailVerificationToken" TEXT,
    "emailVerificationExpiry" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "accountLockedUntil" TIMESTAMP(3),
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "twoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth.User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth.User_email_key" ON "auth.User"("email");

-- CreateIndex
CREATE INDEX "auth.User_email_idx" ON "auth.User"("email");

-- CreateIndex
CREATE INDEX "auth.User_username_idx" ON "auth.User"("username");

-- CreateIndex
CREATE INDEX "auth.User_status_idx" ON "auth.User"("status");
