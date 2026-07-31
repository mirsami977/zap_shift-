import { useCallback, useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../api/client";
import Alert from "../../components/ui/Alert";
import Loading from "../../components/ui/Loading";

const ManageUsers = () => {
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .get("/users", { params: search ? { search } : {} })
      .then(({ data }) => setUsers(data))
      .catch((requestError) => setError(apiErrorMessage(requestError)));
  }, [search]);

  useEffect(load, [load]);

  const changeRole = async (userId, role) => {
    setError("");
    try {
      await api.patch(`/users/${userId}/role`, { role });
      load();
    } catch (updateError) {
      setError(apiErrorMessage(updateError));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#0D3B36]">Manage users</h1>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by email"
        className="input input-bordered input-sm w-full max-w-xs"
      />
      <Alert type="error">{error}</Alert>

      {!users ? (
        <Loading label="Loading users..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td className="text-xs">{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(event) => changeRole(user._id, event.target.value)}
                      className="select select-bordered select-xs"
                    >
                      <option value="user">user</option>
                      <option value="rider">rider</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
