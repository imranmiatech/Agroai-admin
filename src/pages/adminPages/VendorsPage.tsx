import { useState } from 'react';
import { 
  BarChart2, 
  UserPlus, 
  Plus
} from 'lucide-react';
import { 
  PartnershipRequestsTable, 
  PartnersOverviewView, 
  PartnersModals 
} from '../../components/adminComponents/partners';

export interface CategoryItem {
  name: string;
  count: number;
  color: string;
}

export type RequestStatus = 'Contacted' | 'In discussion' | 'new' | 'declined';

export interface PartnershipRequest {
  id: string;
  businessName: string;
  description: string;
  category: string;
  ownerName: string;
  email: string;
  phone: string;
  status: RequestStatus;
  submittedDate: string;
}

export const VendorsPage = () => {
  // Navigation tabs: Only 'overview' and 'requests'
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('requests');

  // Detail Modal state for selected request
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null);

  // Modal states for Create Offer
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    partnerName: '',
    category: 'Supermarket',
    discount: '15%',
    expiresIn: '30 days'
  });

  // Category breakdown data matching Figma
  const categories: CategoryItem[] = [
    { name: 'Indoor Playground', count: 5, color: '#EF4444' },
    { name: 'Supermarket', count: 6, color: '#059669' },
    { name: 'Entertainment', count: 5, color: '#0EA5E9' },
    { name: 'Toy Stores', count: 4, color: '#8B5CF6' },
    { name: 'General Store', count: 6, color: '#F59E0B' },
    { name: 'Learning Centres', count: 4, color: '#EC4899' },
    { name: 'Book Stores', count: 4, color: '#F43F5E' },
    { name: 'Children\'s Cafés', count: 4, color: '#14B8A6' },
    { name: 'Other', count: 3, color: '#94A3B8' }
  ];

  // Partnership requests data
  const [requests, setRequests] = useState<PartnershipRequest[]>([
    {
      id: 'REQ-201',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Clara Gallagher',
      email: 'clara@safesleepireland.ie',
      phone: '+353 87 123 4567',
      status: 'Contacted',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-202',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Liam O’Sullivan',
      email: 'liam@safesleepcare.ie',
      phone: '+353 89 234 5678',
      status: 'In discussion',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-203',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Aoife Kelly',
      email: 'aoife@safesleepwellness.com',
      phone: '+353 86 345 6789',
      status: 'Contacted',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-204',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Sean Murphy',
      email: 'sean@safesleeppractices.ie',
      phone: '+353 85 456 7890',
      status: 'new',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-205',
      businessName: 'Safe Sleep Practices for Infants',
      description: 'Evidence-based safe sleep .........',
      category: 'Indoor Playground',
      ownerName: 'Niamh Byrne',
      email: 'niamh@safesleepguidance.ie',
      phone: '+353 87 567 8901',
      status: 'declined',
      submittedDate: 'Jul 6, 2025'
    },
    {
      id: 'REQ-206',
      businessName: 'SuperValu Fresh Market Dublin',
      description: 'Organic baby produce & nutritious family meal prep packs.',
      category: 'Supermarket',
      ownerName: 'Conor Walsh',
      email: 'conor.walsh@supervalu.ie',
      phone: '+353 89 678 9012',
      status: 'Contacted',
      submittedDate: 'Jul 5, 2025'
    },
    {
      id: 'REQ-207',
      businessName: 'Little Learners Sensory Academy',
      description: 'Early childhood development and motor skills workshops.',
      category: 'Learning Centres',
      ownerName: 'Sinead Dunne',
      email: 'sinead@littlelearners.ie',
      phone: '+353 86 789 0123',
      status: 'new',
      submittedDate: 'Jul 4, 2025'
    },
    {
      id: 'REQ-208',
      businessName: 'Dublin Toy Emporium',
      description: 'Eco-certified wooden toys, puzzles, and sensory items.',
      category: 'Toy Stores',
      ownerName: 'Patrick O’Donnell',
      email: 'patrick@dublintoyemporium.com',
      phone: '+353 85 890 1234',
      status: 'In discussion',
      submittedDate: 'Jul 3, 2025'
    }
  ]);

  // Update status handler for detail modal
  const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  // Create offer handler
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.title || !newOffer.partnerName) return;
    setShowCreateOfferModal(false);
    setNewOffer({
      title: '',
      partnerName: '',
      category: 'Supermarket',
      discount: '15%',
      expiresIn: '30 days'
    });
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Page Header (Partners Title, Subtitle & "+ Create Offer" Button) */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Partners
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage partner businesses, offers, and partnership requests across the Krisikunjo platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateOfferModal(true)}
          className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-slate-800" strokeWidth={2.4} />
          <span>Create Offer</span>
        </button>
      </div>

      {/* 2. Top Tab Navigation Capsule (Only Overview & Partnership Requests) */}
      <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-full p-1.5 shadow-2xs self-start gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#062E35] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#062E35] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Partnership Requests</span>
        </button>
      </div>

      {/* VIEW 1: PARTNERSHIP REQUESTS TAB */}
      {activeTab === 'requests' && (
        <PartnershipRequestsTable
          requests={requests}
          categories={categories}
          onSelectRequest={(req) => setSelectedRequest(req)}
        />
      )}

      {/* VIEW 2: OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <PartnersOverviewView
          categories={categories}
          onNavigateToRequests={() => setActiveTab('requests')}
        />
      )}

      {/* MODALS */}
      <PartnersModals
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        handleUpdateStatus={handleUpdateStatus}
        showCreateOfferModal={showCreateOfferModal}
        setShowCreateOfferModal={setShowCreateOfferModal}
        newOffer={newOffer}
        setNewOffer={setNewOffer}
        handleCreateOffer={handleCreateOffer}
        categories={categories}
      />
    </div>
  );
};
