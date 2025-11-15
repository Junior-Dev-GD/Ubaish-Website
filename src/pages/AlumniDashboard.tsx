import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Award, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDocuments, downloadDocument, getStoredUser, clearAuthTokens } from "@/api";
import { useNavigate } from "react-router-dom";

interface Document {
  id: number;
  title: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
  is_verified: boolean;
  file_size: number;
}

const AlumniDashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      navigate("/alumni");
      return;
    }
    fetchDocuments();
  }, [user, navigate]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getDocuments();
      setDocuments(response.results || response);
    } catch (error: any) {
      toast({
        title: "Failed to load documents",
        description: error.message || "Could not fetch your documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId: number, title: string) => {
    try {
      setDownloading(documentId);
      await downloadDocument(documentId);
      toast({
        title: "Download started",
        description: `${title} is being downloaded.`,
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message || "Could not download document.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    navigate("/alumni");
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "TRANSCRIPT":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "CERTIFICATE":
      case "DIPLOMA":
        return <Award className="h-8 w-8 text-yellow-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter documents by type
  const transcripts = documents.filter((doc) => doc.document_type === "TRANSCRIPT");
  const certificates = documents.filter(
    (doc) => doc.document_type === "CERTIFICATE" || doc.document_type === "DIPLOMA"
  );
  const otherDocuments = documents.filter(
    (doc) => doc.document_type !== "TRANSCRIPT" && doc.document_type !== "CERTIFICATE" && doc.document_type !== "DIPLOMA"
  );

  const canDownload = !user?.owes_fees && !user?.total_debt;

  return (
    <div className="py-12 min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-serif text-4xl font-bold text-primary mb-2">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
              <p className="text-muted-foreground">
                Manage your documents and download transcripts and testimonials
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* User Info Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{user?.email}</p>
                </div>
                {user?.student_id && (
                  <div>
                    <span className="text-muted-foreground">Student ID:</span>
                    <p className="font-medium">{user.student_id}</p>
                  </div>
                )}
                {user?.graduation_year && (
                  <div>
                    <span className="text-muted-foreground">Graduation Year:</span>
                    <p className="font-medium">{user.graduation_year}</p>
                  </div>
                )}
                {user?.total_debt && user.total_debt > 0 && (
                  <div>
                    <span className="text-muted-foreground">Outstanding Debt:</span>
                    <p className="font-medium text-red-600">${user.total_debt}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Debt Warning */}
          {!canDownload && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">
                    Outstanding Fees Detected
                  </p>
                  <p className="text-sm text-red-700">
                    Please clear your outstanding fees to download documents.
                    Contact the administration office for assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading documents...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Transcripts Section */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Transcripts
              </h2>
              {transcripts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transcripts.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          {getDocumentIcon(doc.document_type)}
                          {doc.is_verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg mt-2">{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            <p>Uploaded: {formatDate(doc.uploaded_at)}</p>
                            <p>Size: {formatFileSize(doc.file_size)}</p>
                          </div>
                          <Button
                            onClick={() => handleDownload(doc.id, doc.title)}
                            disabled={!canDownload || downloading === doc.id}
                            className="w-full"
                            variant={canDownload ? "default" : "outline"}
                          >
                            {downloading === doc.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Download Transcript
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transcripts available yet.</p>
                    <p className="text-sm mt-2">
                      Transcripts will appear here once they are uploaded and verified.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Certificates & Testimonials Section */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Award className="h-6 w-6" />
                Certificates & Testimonials
              </h2>
              {certificates.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certificates.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          {getDocumentIcon(doc.document_type)}
                          {doc.is_verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg mt-2">{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            <p>Uploaded: {formatDate(doc.uploaded_at)}</p>
                            <p>Size: {formatFileSize(doc.file_size)}</p>
                          </div>
                          <Button
                            onClick={() => handleDownload(doc.id, doc.title)}
                            disabled={!canDownload || downloading === doc.id}
                            className="w-full"
                            variant={canDownload ? "default" : "outline"}
                          >
                            {downloading === doc.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Download {doc.document_type === "DIPLOMA" ? "Diploma" : "Certificate"}
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No certificates or testimonials available yet.</p>
                    <p className="text-sm mt-2">
                      Certificates and testimonials will appear here once they are uploaded and verified.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Other Documents Section */}
            {otherDocuments.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold text-primary mb-4">Other Documents</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          {getDocumentIcon(doc.document_type)}
                          {doc.is_verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg mt-2">{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            <p>Uploaded: {formatDate(doc.uploaded_at)}</p>
                            <p>Size: {formatFileSize(doc.file_size)}</p>
                          </div>
                          <Button
                            onClick={() => handleDownload(doc.id, doc.title)}
                            disabled={!canDownload || downloading === doc.id}
                            className="w-full"
                            variant={canDownload ? "default" : "outline"}
                          >
                            {downloading === doc.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDashboard;

