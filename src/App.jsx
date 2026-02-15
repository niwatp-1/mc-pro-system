import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './components/views/LoginPage';
import Dashboard from './components/views/Dashboard';
import EventList from './components/views/EventList';
import EventDetail from './components/views/EventDetail';
import CreateEventForm from './components/views/CreateEventForm';
import ClientsPage from './components/views/ClientsPage';
import ScriptsPage from './components/views/ScriptsPage';
import UsersPage from './components/views/UsersPage';
import SettingsPage from './components/views/SettingsPage';
import ScriptViewer from './components/modals/ScriptViewer';
import Icon from './components/ui/Icon';
import Button from './components/ui/Button';
import Logo from './components/ui/Logo';
import { supabase } from './utils/supabaseClient';

const App = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('mc_auth') === 'true');
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('mc_user')) || null);

  // App Data State
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Navigation & View State
  const [view, setView] = useState('dashboard');
  const [subFilter, setSubFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewingScript, setViewingScript] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Realtime Subscription
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('public:db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scripts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_users' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, currentUser]); // Re-subscribe if user changes (for isolation logic in fetchData)

  // Initial Data Fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let eventsQuery = supabase.from('events').select('*');
      let clientsQuery = supabase.from('clients').select('*');
      let scriptsQuery = supabase.from('scripts').select('*');
      let usersQuery = supabase.from('app_users').select('*');

      // If NOT Admin, filter by owner_id
      if (currentUser && currentUser.role !== 'ADMIN') {
        eventsQuery = eventsQuery.eq('owner_id', currentUser.id);
        clientsQuery = clientsQuery.eq('owner_id', currentUser.id);
        // scriptsQuery = scriptsQuery.eq('owner_id', currentUser.id); // Scripts are currently shared (no owner_id col)
        // Users can only see themselves? Or all users? 
        // Usually users might need to see other users if there is collaboration, 
        // but for now let's keep users visible or restrict if needed. 
        // The user said "user แยก section", usually implies primary data (events/clients).
      }

      const { data: eventsData } = await eventsQuery;
      const { data: clientsData } = await clientsQuery;
      const { data: scriptsData } = await scriptsQuery;
      const { data: usersData } = await usersQuery;

      if (eventsData) setEvents(eventsData);
      if (clientsData) setClients(clientsData);
      if (scriptsData) setScripts(scriptsData);
      if (usersData) setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auth Handlers
  const handleLogin = async (username, password, onError) => {
    try {
      const { data, error } = await supabase
        .from('app_users') // Change table name
        .select('*')
        .eq('username', username)
        .eq('password', password) // Note: In production, hash passwords!
        .single();

      if (data) {
        setIsAuthenticated(true);
        setCurrentUser(data);
        localStorage.setItem('mc_auth', 'true');
        localStorage.setItem('mc_user', JSON.stringify(data));
      } else {
        onError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      onError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('mc_auth');
    localStorage.removeItem('mc_user');
    setView('dashboard');
    // Clear data on logout
    setEvents([]);
    setClients([]);
    setScripts([]);
  };

  // --- CRUD Operations ---

  // Events
  const handleSaveEvent = async (eventData) => {
    try {
      const { id, ...payload } = eventData;
      if (id && events.some(e => e.id === id)) {
        // Update
        const { error, data } = await supabase.from('events').update(payload).eq('id', id).select().single();
        if (error) throw error;
        setEvents(events.map(e => e.id === id ? data : e));
        setSelectedEvent(data); // Update loaded detail view
      } else {
        // Create
        const { error, data } = await supabase.from('events').insert([{ ...payload, owner_id: currentUser.id }]).select().single();
        if (error) throw error;
        setEvents([...events, data]);
      }
      setView('events');
    } catch (error) {
      alert('Error saving event: ' + error.message);
    }
  };

  // Clients
  const handleAddClient = async (clientData) => {
    try {
      const { id, ...payload } = clientData; // remove temp id if exists
      const { error, data } = await supabase.from('clients').insert([payload]).select().single();
      if (error) throw error;
      setClients([...clients, data]);
    } catch (error) {
      alert('Error adding client: ' + error.message);
    }
  };

  // Scripts
  const handleUploadScript = async (scriptData) => {
    try {
      const { id, ...payload } = scriptData;
      const { error, data } = await supabase.from('scripts').insert([payload]).select().single();
      if (error) throw error;
      setScripts([...scripts, data]);
    } catch (error) {
      alert('Error uploading script: ' + error.message);
    }
  };

  const handleDeleteScript = async (id) => {
    try {
      const { error } = await supabase.from('scripts').delete().eq('id', id);
      if (error) throw error;
      setScripts(scripts.filter(s => s.id !== id));
    } catch (error) {
      alert('Error deleting script: ' + error.message);
    }
  };

  // Users
  const handleAddUser = async (userData) => {
    try {
      const { error, data } = await supabase.from('app_users').insert([userData]).select().single();
      if (error) throw error;
      setUsers([...users, data]);
    } catch (error) {
      alert('Error adding user: ' + error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const { error } = await supabase.from('app_users').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const { id, ...payload } = userData;
      const { error, data } = await supabase.from('app_users').update(payload).eq('id', id).select().single();
      if (error) throw error;

      setUsers(users.map(u => u.id === id ? data : u));
      setCurrentUser(data);
      localStorage.setItem('mc_user', JSON.stringify(data));
      alert('อัปเดตข้อมูลสำเร็จ');
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  // Navigation Handlers
  const navigate = (page, filter = 'ALL') => {
    if (page === 'event-detail') {
      setSelectedEvent(filter);
      setView('event-detail');
    } else if (page === 'events') {
      setSubFilter(filter);
      setView('events');
    } else {
      setView(page);
    }
  };

  // View Rendering
  const renderView = () => {
    if (loading && !events.length && !clients.length) return <div className="flex justify-center items-center h-full text-zinc-500">Loading data...</div>;

    switch (view) {
      case 'dashboard':
        return <Dashboard events={events} clients={clients} onChangeView={navigate} />;
      case 'events':
        return <EventList
          events={events}
          users={users}
          currentUser={currentUser}
          onSelectEvent={(evt) => { setSelectedEvent(evt); setView('event-detail'); }}
          onCreateEvent={() => { setSelectedEvent(null); setView('create-event'); }}
          onEditEvent={(evt) => { setSelectedEvent(evt); setView('create-event'); }}
          initialFilter={subFilter}
        />;
      case 'event-detail':
        return selectedEvent ? <EventDetail
          event={selectedEvent}
          onBack={() => setView('events')}
          onUpdateEvent={handleSaveEvent} // Auto update functionality in Detail
          onViewScript={setViewingScript}
        /> : <div className="text-zinc-500">ไม่พบข้อมูลงาน</div>;
      case 'create-event':
        return <CreateEventForm
          clients={clients}
          initialData={selectedEvent}
          onCancel={() => setView('events')}
          onSave={handleSaveEvent}
        />;
      case 'clients':
        return <ClientsPage
          clients={clients}
          users={users}
          currentUser={currentUser}
          onAddClient={handleAddClient}
        />;
      case 'scripts':
        return <ScriptsPage
          scripts={scripts}
          onUploadScript={handleUploadScript}
          onDeleteScript={handleDeleteScript}
          onViewScript={setViewingScript}
        />;
      case 'users':
        return currentUser.role === 'ADMIN' ?
          <UsersPage
            users={users}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
          /> : <div className="text-red-500">Access Denied</div>;
      case 'settings':
        return <SettingsPage
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
        />;
      default: return <Dashboard events={events} clients={clients} onChangeView={navigate} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden bg-zinc-950 text-white selection:bg-[#25F4EE] selection:text-black">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex justify-between items-center">
        <Logo className="w-8 h-8" textSize="text-sm" />
        <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} />
        </Button>
      </header>

      <Sidebar
        view={view}
        onChangeView={navigate}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={setIsMobileMenuOpen}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <main className="flex-1 overflow-y-auto h-screen pt-20 md:pt-0 bg-zinc-950 relative w-full no-scrollbar">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32 md:pb-10">
          {renderView()}
        </div>
      </main>

      {viewingScript && <ScriptViewer script={viewingScript} onClose={() => setViewingScript(null)} />}
    </div>
  );
};

export default App;
