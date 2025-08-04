import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import {
  fetchScenarios,
  NotificationScenario,
} from "../../api/notificationScenarios";

const Notifications = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<NotificationScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    totalPages: 1,
    totalRecords: 0,
  });

  const NotificationTableDefinition = useMemo(
    () => [
      {
        label: "Notification Scenarios",
        className: "orangeFont",
        hasSort: true,
        sortKey: "name",
        render: (item: NotificationScenario) => (
          <Clickable className="text-start" onClick={() => {}}>
            <p className="orangeFont">{item?.notificationScenario}</p>
          </Clickable>
        ),
        width: 80,
      },
      {
        label: "Actions",
        render: (item: NotificationScenario) => (
          <Action icon="edit" onClick={() => navigate(`/edit/${item.id}`)} />
        ),
        width: 10,
      },
      {
        label: "Is Active",
        hasSort: true,
        sortKey: "isActive",
        render: (item: NotificationScenario) => (
          <Icon icon={item.isActive ? "correct-tick" : "wrong-tick"} />
        ),
        width: 10,
      },
    ],
    [navigate]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchScenarios(
          pagination.page,
          pagination.limit
        );
        setData(response.data.scenarios);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalRecords: response.data.pagination.total,
        }));
      } catch (err: any) {
        console.error("Error loading scenarios:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pagination.page, pagination.limit]);

  return (
    <Container>
      <SubHeader>
        <SearchBar />
        <Button to="/add">Add New</Button>
      </SubHeader>

      <FilterContainer definition={NotificationTableDefinition} />

      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <Table
          defaultSort="name:asc"
          data={data}
          definition={NotificationTableDefinition}
        />
      )}

      <PaginationProvider
        pagination={{
          currentPage: pagination.page,
          totalRecords: pagination.totalRecords,
          numberOfPages: pagination.totalPages,
        }}
        onPageChange={(newPage: number) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
      />
    </Container>
  );
};

export default Notifications;
