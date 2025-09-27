import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { 
  Download, 
  FileText, 
  Lock, 
  Unlock, 
  Eye, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { mockApi } from '../../mock';

const DownloadsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({});
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [selectedDoc, setSelectedDoc] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await mockApi.getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handlePasswordChange = (docId, password) => {
    setPasswords(prev => ({
      ...prev,
      [docId]: password
    }));
  };

  const handleDownload = async (document) => {
    if (!document.passwordProtected) {
      // Direct download for non-protected files
      downloadFile(document);
      return;
    }

    const password = passwords[document.id];
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter the password to download this document.",
        variant: "destructive"
      });
      return;
    }

    setDownloadingIds(prev => new Set(prev).add(document.id));

    try {
      const response = await mockApi.downloadDocument(document.id, password);
      if (response.success) {
        downloadFile(document);
        toast({
          title: "Download Started",
          description: `${document.fileName} is being downloaded.`,
        });
        
        // Clear password after successful download
        setPasswords(prev => {
          const newPasswords = { ...prev };
          delete newPasswords[document.id];
          return newPasswords;
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error === 'Invalid password' ? 
          "Incorrect password. Please try again." : 
          "Failed to download document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        return newSet;
      });
    }
  };

  const downloadFile = (document) => {
    // Simulate file download
    console.log(`Downloading: ${document.fileName}`);
    
    // In a real implementation, this would trigger an actual file download
    const link = document.createElement('a');
    link.href = '#'; // Would be the actual file URL
    link.download = document.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const DocumentPreview = ({ document }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setSelectedDoc(document)}
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {document.fileName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {document.passwordProtected ? (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                <Lock className="w-3 h-3 mr-1" />
                Password Protected
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <Unlock className="w-3 h-3 mr-1" />
                Public Access
              </Badge>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Description
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {document.description}
            </p>
          </div>
          
          {document.passwordProtected && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    Password Required
                  </h5>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    This document contains sensitive information and requires a password to access. 
                    Please contact me if you need the password for legitimate purposes.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => handleDownload(document)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={downloadingIds.has(document.id)}
            >
              {downloadingIds.has(document.id) ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Downloading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download {document.fileName}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const protectedDocs = documents.filter(doc => doc.passwordProtected);
  const publicDocs = documents.filter(doc => !doc.passwordProtected);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Downloads & Resources
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Access my professional documents, certifications, and teaching resources. 
          Some documents are password-protected for privacy and security.
        </p>
      </div>

      {/* Security Notice */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Privacy & Security Notice
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Personal documents like resume and certifications are password-protected to maintain privacy. 
                If you're a potential employer or collaborator and need access to these documents, 
                please contact me directly and I'll be happy to provide the necessary credentials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Documents */}
      {publicDocs.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Public Resources
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {publicDocs.map((document) => (
              <Card key={document.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {document.fileName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {document.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DocumentPreview document={document} />
                      <Button
                        onClick={() => handleDownload(document)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={downloadingIds.has(document.id)}
                      >
                        {downloadingIds.has(document.id) ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Protected Documents */}
      {protectedDocs.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Protected Documents
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {protectedDocs.map((document) => (
              <Card key={document.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {document.fileName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {document.description}
                          </p>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            <Lock className="w-3 h-3 mr-1" />
                            Password Required
                          </Badge>
                        </div>
                      </div>
                      <DocumentPreview document={document} />
                    </div>

                    <div className="flex items-center gap-3">
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={passwords[document.id] || ''}
                        onChange={(e) => handlePasswordChange(document.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleDownload(document)}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                        disabled={downloadingIds.has(document.id)}
                      >
                        {downloadingIds.has(document.id) ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Downloading...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </div>
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Hint: Try "teacher123" for demo purposes
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Download Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20">
        <CardContent className="p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {documents.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Documents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {publicDocs.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Public Resources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {protectedDocs.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Protected Files</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadsSection;