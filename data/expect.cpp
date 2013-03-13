#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <vector>

using namespace std;

#define BEGIN_OF_DATA		"Beginning of second trial"
#define END_OF_DATA			"End of second trial"
#define SCENARIO_NUM		5
#define INFORMATION_NUM		4
#define PARTICIPANT_NUM		5
#define SCENARIO_QUESTION	(PARTICIPANT_NUM * INFORMATION_NUM)
#define TOTAL_QUESTION		(SCENARIO_NUM * SCENARIO_QUESTION)

const char CORRECT_ANSWER[TOTAL_QUESTION + 1] = 
	"11111111111111111111"\
	"11111100011000110001"\
	"00000111111111111111"\
	"00111111111111111111"\
	"00111110011100111001";

const char Scenarios[SCENARIO_NUM][200] = {
	"You visit http://emailprovider.com",
	"You visit https://www.emailprovider.com/",
	"You visit http://www.emailprovider.com/ from the free wifi network at a coffee shop",
	"You visit http://www.emailprovider.com/ using a free HTTP proxy you found online",
	"You visit http://www.emailprovider.com/ using Tor"
};

const char Information[INFORMATION_NUM][200] = {
	"Your Home IP address",
	"Your Email Address",
	"Your Email Password",
	"Your OS & Browser"
};

const char Participants[PARTICIPANT_NUM][200] = {
	"emailprovider.com",
	"emailprovider.com's ISP",
	"Your ISP",
	"A computer on your network",
	"Your computer"
};

struct Answer {
	char time[50];
	char key[200];
	char attest[1000];
};

//vector<Answer*> answer_list;
int ratio[INFORMATION_NUM][PARTICIPANT_NUM];
int n = 0;

char* trim(char *str) 
{
	char *pt = str;
	while (*pt == ' ' || *pt == '\t') ++ pt;

	char *end = pt + strlen(pt) - 1;
	while (*end == ' ' || *end == '\t') -- end;
	*(end + 1) = '\0';

	return pt;
}

Answer* extract_answer(char *str) 
{
	Answer *answer = new Answer;
	char *item = strtok(str, "\t");
	strcpy(answer->time, item);
	//printf("time: %s\n", answer->time);

	item = strtok(NULL, "\t");
	strcpy(answer->key, item);
	//printf("key: %s\n", answer->key);
	
	item = strtok(NULL, "\t");
	strcpy(answer->attest, item);
	//printf("attest: %s\n", answer->attest);

	return answer;
}

void update_score_ratio(Answer *answer)
{
	int s = 0;

	if (strlen(answer->key) < TOTAL_QUESTION + SCENARIO_QUESTION)
		return;

	for (int i = TOTAL_QUESTION; i < TOTAL_QUESTION + SCENARIO_QUESTION; i++) {
		int x = (i % SCENARIO_QUESTION) / PARTICIPANT_NUM;
		int y = (i % SCENARIO_QUESTION) % PARTICIPANT_NUM;
		if (answer->key[i] == '1')
			-- ratio[x][y];
		else if (answer->key[i] == '0')
			++ ratio[x][y];
		else
			printf("error\n");
	}
	++ n;
}

char dec2hex(int num) {
	if (num < 10)
		return 48 + num;
	else
		return 87 + num;
}

void score2color(int num, char* color) {
	if (num >= 0) {
		char c = dec2hex(n - num);
		sprintf(color, "%c%cff%c%c", c, c, c, c);
	} else {
		char c = dec2hex(n + num);
		sprintf(color, "ff%c%c%c%c", c, c, c, c);
	}
}

int main(int argc, const char **argv) 
{
	if (argc < 2)
	{
		printf("%s [<files>]\n", argv[0]);
		return 0;
	}

	FILE *input = fopen(argv[1], "r");
	if (input == NULL)
	{
		printf("Cannot open file %s\n", argv[1]);
		return -1;
	}

	memset(ratio, 0, sizeof(ratio));

	char line[2000];
	bool start = false;

	while (fscanf(input, "%[^\n]\n", line) != EOF) 
	{
		char *data = trim(line);
		if (strcmp(data, BEGIN_OF_DATA) == 0) 
		{
			printf("beginning of data\n");
			start = true;
		} else if (strcmp(data, END_OF_DATA) == 0)
		{
			printf("end of data\n");
			break;
		} else if (start) {
			Answer *a = extract_answer(data);
			update_score_ratio(a);
		}
	}
	fclose(input);

	printf("n = %d\n", n);
	for (int j = 0; j < INFORMATION_NUM; j++)
	{
		for (int k = 0; k < PARTICIPANT_NUM; k++)
			printf("%d\t", ratio[j][k]);
		printf("\n");
	}
	printf("\n");

	printf("<table border='1' style='display: block;'>\n");
	printf("<tr>\n<th width='20%'></th>\n");
	for (int j = 0; j < PARTICIPANT_NUM; j++)
		printf("<th width='16%'>%s</th>\n", Participants[j]);
	printf("</tr>\n");

	for (int j = 0; j < INFORMATION_NUM; j++) {
		printf("<tr>\n<th>%s</th>", Information[j]);
			
		for (int k = 0; k < PARTICIPANT_NUM; k++) {
			char color[7];
			score2color(ratio[j][k], color);
			printf("<td bgColor=#%s/>", color);
		}
		printf("\n</tr>\n");
	}
	printf("</table>\n<br/>\n");

	return 0;
}
