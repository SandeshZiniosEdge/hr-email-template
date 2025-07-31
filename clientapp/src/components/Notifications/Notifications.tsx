import { useMemo } from "react";
import PaginationProvider from "../PaginationProvider/PaginationProvider";
import Button from "../Button/Button";
import Action from "../Custom/Action";
import SubHeader from "../Custom/SubHeader";
import SearchBar from "../SearchBar/SearchBar";
import Table from "../Table/Table";
import Icon from "../Custom/Icon";

import Container from "../Custom/Container";
import { FilterContainer } from "../Custom/FilterContainer";

import Clickable from "../Custom/Clickable";

const Notifications = () => {
  const NotificationTableDefinition = useMemo(
    () => [
      {
        label: "Notification Scenarios",
        className: "orangeFont",
        hasSort: true,
        sortKey: "name",
        render: (item: NotificationType) => (
          <Clickable className="text-start" onClick={() => {}}>
            <p className="orangeFont">{item?.notificationScenario}</p>
          </Clickable>
        ),
        width: 80,
      },
      {
        label: "Actions",
        // condition: permission.canEdit,
        render: (item: NotificationType) => (
          <Action icon="edit" onClick={() => {}} />
        ),
        width: 10,
      },
      {
        label: "Is Active",
        hasSort: true,
        sortKey: "isActive",
        render: (item: NotificationType) => (
          <Icon icon={item.isActive ? "correct-tick" : "wrong-tick"} />
        ),
        width: 10,
      },
    ],
    []
  );

  const data = {
    data: [
      {
        id: 1,
        notificationScenario: "New Employee Onboarding",
        isActive: true,
        name: "employee_onboarding",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        notificationScenario: "Leave Request Submitted",
        isActive: true,
        name: "leave_request",
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-16T09:15:00Z",
      },
      {
        id: 3,
        notificationScenario: "Performance Review Due",
        isActive: false,
        name: "performance_review",
        createdAt: "2024-01-17T14:20:00Z",
        updatedAt: "2024-01-17T14:20:00Z",
      },
      {
        id: 4,
        notificationScenario: "Attendance Irregularity",
        isActive: true,
        name: "attendance_alert",
        createdAt: "2024-01-18T11:45:00Z",
        updatedAt: "2024-01-18T11:45:00Z",
      },
      {
        id: 5,
        notificationScenario: "Employee Birthday Reminder",
        isActive: false,
        name: "birthday_reminder",
        createdAt: "2024-01-19T16:30:00Z",
        updatedAt: "2024-01-19T16:30:00Z",
      },
      {
        id: 6,
        notificationScenario: "Contract Expiry Warning",
        isActive: true,
        name: "contract_expiry",
        createdAt: "2024-01-20T08:10:00Z",
        updatedAt: "2024-01-20T08:10:00Z",
      },
      {
        id: 7,
        notificationScenario: "Training Program Enrollment",
        isActive: true,
        name: "training_enrollment",
        createdAt: "2024-01-21T13:25:00Z",
        updatedAt: "2024-01-21T13:25:00Z",
      },
      {
        id: 8,
        notificationScenario: "Salary Increment Approval",
        isActive: false,
        name: "salary_increment",
        createdAt: "2024-01-22T15:40:00Z",
        updatedAt: "2024-01-22T15:40:00Z",
      },
      {
        id: 9,
        notificationScenario: "Employee Exit Interview",
        isActive: true,
        name: "exit_interview",
        createdAt: "2024-01-23T12:00:00Z",
        updatedAt: "2024-01-23T12:00:00Z",
      },
      {
        id: 10,
        notificationScenario: "Document Submission Reminder",
        isActive: true,
        name: "document_reminder",
        createdAt: "2024-01-24T17:55:00Z",
        updatedAt: "2024-01-24T17:55:00Z",
      },
      {
        id: 11,
        notificationScenario: "Overtime Hours Exceeded",
        isActive: true,
        name: "overtime_alert",
        createdAt: "2024-01-25T09:30:00Z",
        updatedAt: "2024-01-25T09:30:00Z",
      },
      {
        id: 12,
        notificationScenario: "Health Insurance Renewal",
        isActive: false,
        name: "insurance_renewal",
        createdAt: "2024-01-26T14:15:00Z",
        updatedAt: "2024-01-26T14:15:00Z",
      },
      {
        id: 13,
        notificationScenario: "Payroll Processing Complete",
        isActive: true,
        name: "payroll_complete",
        createdAt: "2024-01-27T11:20:00Z",
        updatedAt: "2024-01-27T11:20:00Z",
      },
      {
        id: 14,
        notificationScenario: "Employee Recognition Award",
        isActive: true,
        name: "recognition_award",
        createdAt: "2024-01-28T16:45:00Z",
        updatedAt: "2024-01-28T16:45:00Z",
      },
      {
        id: 15,
        notificationScenario: "Disciplinary Action Required",
        isActive: false,
        name: "disciplinary_action",
        createdAt: "2024-01-29T13:10:00Z",
        updatedAt: "2024-01-29T13:10:00Z",
      },
    ],
    numberOfPages: 2,
    totalRecords: 15,
    currentPage: 1,
    pageSize: 15,
  };

  // TypeScript interface for reference
  interface NotificationType {
    id: number;
    notificationScenario: string;
    isActive: boolean;
    name: string;
    createdAt: string;
    updatedAt: string;
  }

  return (
    <Container>
      <SubHeader>
        <SearchBar />
        <Button to="/admin/notifications/add">Add New</Button>
      </SubHeader>
      <FilterContainer definition={NotificationTableDefinition} />
      <Table
        defaultSort="name:asc"
        data={data?.data ?? []}
        definition={NotificationTableDefinition}
      />

      <PaginationProvider
        pagination={{
          numberOfPages: data?.numberOfPages,
          totalRecords: data?.totalRecords,
        }}
      />
    </Container>
  );
};

export default Notifications;
