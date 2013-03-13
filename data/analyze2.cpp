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
int ratio[SCENARIO_NUM + 1][INFORMATION_NUM + 1][PARTICIPANT_NUM + 1];
int scores[100];
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
	for (int i = 0; i < TOTAL_QUESTION; i++) {
		if (answer->key[i] == CORRECT_ANSWER[i]) {
			++ s;
			++ ratio[i / SCENARIO_QUESTION][(i % SCENARIO_QUESTION) / PARTICIPANT_NUM][(i % SCENARIO_QUESTION) % PARTICIPANT_NUM];
		}
	}
	scores[n++] = s;
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

	for (int i = 0; i < SCENARIO_NUM; i++)
	{
		for (int j = 0; j < INFORMATION_NUM; j++)
		{
			int sum = 0;
			for (int k = 0; k < PARTICIPANT_NUM; k++)
				sum += ratio[i][j][k];
			ratio[i][j][PARTICIPANT_NUM] = sum;
		}
		for (int k = 0; k < PARTICIPANT_NUM; k++)
		{
			int sum = 0;
			for (int j = 0; j < INFORMATION_NUM; j++)
				sum += ratio[i][j][k];
			ratio[i][INFORMATION_NUM][k] = sum;
		}
		for (int j = 0; j < INFORMATION_NUM; j++)
			ratio[i][INFORMATION_NUM][PARTICIPANT_NUM] += ratio[i][j][PARTICIPANT_NUM];
	}

	for (int i = 0; i < SCENARIO_NUM; i++)
	{
		for (int j = 0; j <= INFORMATION_NUM; j++)
			for (int k = 0; k <= PARTICIPANT_NUM; k++)
				ratio[SCENARIO_NUM][j][k] += ratio[i][j][k];
	}

	printf("n = %d\n", n);
	for (int i = 0; i < n; i++) 
	{
		printf("%d\n", scores[i]);
	}

	printf("\n");

	for (int i = 0; i < SCENARIO_NUM; i++) {
		for (int j = 0; j <= INFORMATION_NUM; j++) 
			for (int k = 0; k <= PARTICIPANT_NUM; k++)
				if (j == INFORMATION_NUM && k == PARTICIPANT_NUM)
					printf("%d / %d\n", ratio[i][j][k], n * SCENARIO_QUESTION);
				else if (j == INFORMATION_NUM)
					printf("%d / %d\t", ratio[i][j][k], n * INFORMATION_NUM);
				else if (k == PARTICIPANT_NUM)
					printf("%d / %d\n", ratio[i][j][k], n * PARTICIPANT_NUM);
				else
					printf("%d / %d\t", ratio[i][j][k], n);
		printf("\n");
	}

	for (int j = 0; j <= INFORMATION_NUM; j++) 
		for (int k = 0; k <= PARTICIPANT_NUM; k++)
			if (j == INFORMATION_NUM && k == PARTICIPANT_NUM)
				printf("%d / %d\n", ratio[SCENARIO_NUM][j][k], n * TOTAL_QUESTION);
			else if (j == INFORMATION_NUM)
				printf("%d / %d\t", ratio[SCENARIO_NUM][j][k], n * SCENARIO_NUM * INFORMATION_NUM);
			else if (k == PARTICIPANT_NUM)
				printf("%d / %d\n", ratio[SCENARIO_NUM][j][k], n * SCENARIO_NUM * PARTICIPANT_NUM);
			else
				printf("%d / %d\t", ratio[SCENARIO_NUM][j][k], n * SCENARIO_NUM);
	printf("\n");

	for (int i = 0; i < SCENARIO_NUM; i++)
	{
		printf("<b>Scenario:</b>\n");
		printf("<span id='scenario' style='display:block;'>%s</span>\n", Scenarios[i]);
		printf("<table border='1' style='display: block;'>\n");
		printf("<tr>\n<th width='20%'></th>\n");
		for (int j = 0; j < PARTICIPANT_NUM; j++)
			printf("<th width='16%'>%s</th>\n", Participants[j]);
		printf("</tr>\n");

		for (int j = 0; j < INFORMATION_NUM; j++) {
			printf("<tr>\n<th>%s</th>\n", Information[j]);
			
			for (int k = 0; k < PARTICIPANT_NUM; k++) {
				printf("<td>");
				if (n - ratio[i][j][k] == 0)
					printf("%2d / 0", ratio[i][j][k]);
				else {
					if (CORRECT_ANSWER[i * SCENARIO_QUESTION + k + j * PARTICIPANT_NUM] == '1')
						printf("%2d / <font color='red'>%2d</font>", ratio[i][j][k], n - ratio[i][j][k]);
					else
						printf("%2d / <font color='green'>%2d</font>", ratio[i][j][k], n - ratio[i][j][k]);
				}
				printf("</td>\n");
			}
			printf("</tr>\n");
		}
		printf("</table>\n<br/>\n");
	}

	return 0;
}
